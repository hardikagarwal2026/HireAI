import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { DataService, Message, Transcription } from '../../services/data.service';
import { interval, Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-ai-interview',
    standalone: true,
    imports: [CommonModule, HttpClientModule, RouterModule],
    templateUrl: './ai-interview.component.html',
    styleUrl: './ai-interview.component.css'
})
export class AiInterviewComponent implements OnInit, OnDestroy {
    private statusCheckSubscription?: Subscription;
    public callStatus: string = 'initiating';
    public processingState: string = '';
    public errorMessage: string = '';
    public audioUrl: string = '';
    private maxRetries = 30;
    private retryCount = 0;

    constructor(
        private http: HttpClient,
        public dataService: DataService,
        private router: Router
    ) { }

    ngOnInit(): void {
        this.monitorCallStatus();
    }

    ngOnDestroy(): void {
        if (this.statusCheckSubscription) {
            this.statusCheckSubscription.unsubscribe();
        }
        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
        }
    }

    public monitorCallStatus(): void {
        this.callStatus = 'initiating';
        this.errorMessage = '';
        this.retryCount = 0;
        this.processingState = '';
        
        if (this.statusCheckSubscription) {
            this.statusCheckSubscription.unsubscribe();
        }

        this.checkCallStatus();
        
        this.statusCheckSubscription = interval(5000)
            .pipe(
                takeWhile(() => {
                    return this.retryCount < this.maxRetries && 
                           !['completed', 'failed'].includes(this.callStatus);
                })
            )
            .subscribe(() => {
                this.checkCallStatus();
            });
    }

    private checkCallStatus(): void {
        console.log('Checking call status...', this.retryCount);
        this.http.get('http://localhost:4000/api/calls/status').subscribe(
            (response: any) => {
                console.log('Status response:', response);
                this.retryCount++;
                
                if (response.status === 'completed') {
                    this.callStatus = 'completed';
                    if (this.statusCheckSubscription) {
                        this.statusCheckSubscription.unsubscribe();
                    }
                    this.processInterviewData();
                } else if (response.status === 'failed') {
                    this.callStatus = 'failed';
                    this.errorMessage = response.error || 'Call failed to connect';
                    if (this.statusCheckSubscription) {
                        this.statusCheckSubscription.unsubscribe();
                    }
                } else if (response.status === 'in_progress') {
                    this.callStatus = 'in_progress';
                } else {
                    if (this.retryCount >= this.maxRetries) {
                        this.callStatus = 'failed';
                        this.errorMessage = 'Call initialization timed out. Please try again.';
                        if (this.statusCheckSubscription) {
                            this.statusCheckSubscription.unsubscribe();
                        }
                    }
                }
            },
            (error) => {
                console.error('Error checking call status:', error);
                this.retryCount++;
                if (this.retryCount >= this.maxRetries) {
                    this.callStatus = 'failed';
                    this.errorMessage = 'Failed to check call status. Please try again.';
                    if (this.statusCheckSubscription) {
                        this.statusCheckSubscription.unsubscribe();
                    }
                }
            }
        );
    }

    private processInterviewData(): void {
        this.processingState = 'downloading';
        console.log('🔄 Starting to process interview data...');
        
        this.http.get('http://localhost:4000/api/calls').subscribe(
            (response: any) => {
                console.log("📥 Raw API Response:", response);
                
                try {
                    if (!response) {
                        throw new Error('No response data received');
                    }

                    if (response.recording_file) {
                        this.audioUrl = `http://localhost:4000/api/recordings/${response.recording_file}`;
                        console.log("🎵 Audio URL set to:", this.audioUrl);
                    } else {
                        console.log("⚠️ No recording file in response");
                    }

                    if (response.structured_conversation) {
                        console.log("📝 Setting structured conversation:", response.structured_conversation);
                        this.dataService.setTranscription(response.structured_conversation);
                    } else {
                        console.warn("⚠️ No structured conversation in response");
                        if (response.raw_transcription) {
                            const basicStructure: Transcription = {
                                conversation: [{
                                    speaker: 'AI_HR' as const,
                                    text: response.raw_transcription
                                }]
                            };
                            this.dataService.setTranscription(basicStructure);
                        } else {
                            this.dataService.clearTranscription();
                        }
                    }

                    const transcript = response.raw_transcription || 
                                    response.structured_conversation?.conversation
                                        ?.map((msg: Message) => msg.text)
                                        ?.join('\n') || '';
                        
                    console.log("📝 Extracted transcript:", transcript);
                    
                    if (!transcript) {
                        throw new Error('No transcript found in response structure');
                    }

                    this.processingState = 'transcribing';
                    this.dataService.job = transcript;
                    console.log("🎯 Starting evaluation with transcript:", this.dataService.job);
                    
                    if (!this.dataService.summary) {
                        this.dataService.summary = "ML role candidate interview evaluation";
                    }
                    console.log("📋 Using summary:", this.dataService.summary);
                    
                    this.evaluateInterview(this.dataService.job, this.dataService.summary);
                } catch (error: any) {
                    console.error("❌ Error processing response:", error.message);
                    console.error("🔍 Response structure:", response);
                    this.processingState = 'error';
                    this.errorMessage = `Failed to process interview data: ${error.message}`;
                }
            },
            (error: any) => {
                console.error("❌ Error fetching interview data:", error);
                this.processingState = 'error';
                this.errorMessage = `Failed to fetch interview data: ${error.message || 'Unknown error'}`;
            }
        );
    }

    private evaluateInterview(conversation: string, summary: string): void {
        this.processingState = 'evaluating';
        console.log('🔄 Starting interview evaluation...');
        
        if (!conversation) {
            this.processingState = 'error';
            this.errorMessage = 'No interview conversation data available';
            return;
        }

        const conversationArray = conversation
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);

        const defaultSummary = "ML role candidate interview evaluation";
        const processedSummary = summary || defaultSummary;

        const jobData = {
            conversation: conversationArray,
            summary: processedSummary,
            phoneNumber: this.dataService.phoneNumber
        };

        console.log("📤 Sending evaluation data:", jobData);

        this.http.post('http://localhost:4000/api/finaleval', jobData).subscribe(
            (response: any) => {
                console.log("✅ Final evaluation response:", response);
                
                if (!response) {
                    throw new Error('No evaluation data in response');
                }

                this.processingState = 'done';
                this.dataService.evaluationResults = response;
                console.log("💾 Stored evaluation results:", this.dataService.evaluationResults);
            },
            (error: any) => {
                console.error("❌ Error evaluating interview:", error);
                console.error("📋 Request data was:", jobData);
                this.processingState = 'error';
                this.errorMessage = `Failed to evaluate interview: ${error.message || 'Unknown error'}`;
            }
        );
    }

    public retryProcessing(): void {
        this.processInterviewData();
    }

    public viewResults(): void {
        this.router.navigate(['/interview-results']);
    }

    public downloadRecording(): void {
        if (this.audioUrl) {
            const link = document.createElement('a');
            link.href = this.audioUrl;
            link.download = 'interview-recording.wav';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
}
