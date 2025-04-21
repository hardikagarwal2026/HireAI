import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataService, Message, Transcription } from '../../services/data.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-interview-results',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="results-container" *ngIf="dataService.evaluationResults">
            <!-- Interview Session Section -->
            <div class="interview-session">
                <h1>AI Interview Session</h1>
                
                <!-- Transcription Display -->
                <div class="transcription-container">
                    <h3>Interview Transcription</h3>
                    <div class="chat-container">
                        <div *ngFor="let message of dataService.transcription?.conversation" 
                             class="message" 
                             [class.ai-message]="message.speaker === 'AI_HR'"
                             [class.candidate-message]="message.speaker === 'Candidate'">
                            <div class="message-header">
                                <i [class]="message.speaker === 'AI_HR' ? 'fas fa-robot' : 'fas fa-user'"></i>
                                <span>{{ message.speaker === 'AI_HR' ? 'AI Interviewer' : 'Candidate' }}</span>
                            </div>
                            <div class="message-content">
                                {{ message.text }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Final Evaluation Section -->
            <h2>Final Evaluation</h2>
            <div class="evaluation-grid">
                <!-- Analysis Summary -->
                <div class="analysis-card">
                    <h3>Analysis Summary</h3>
                    
                    <div class="strengths">
                        <h4>
                            <span class="plus-icon">+</span>
                            Strengths
                        </h4>
                        <ul>
                            <li *ngFor="let strength of dataService.evaluationResults.strengths">
                                {{ strength }}
                            </li>
                        </ul>
                    </div>

                    <div class="improvements">
                        <h4>
                            <span class="arrow-icon">→</span>
                            Areas for Improvement
                        </h4>
                        <ul>
                            <li *ngFor="let area of dataService.evaluationResults.areasForImprovement">
                                {{ area }}
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Final Decision -->
                <div class="decision-card">
                    <h3>Final Decision</h3>
                    
                    <div class="decision-status" 
                         [class.accepted]="dataService.evaluationResults.finalDecision.decision === 'Accepted'"
                         [class.rejected]="dataService.evaluationResults.finalDecision.decision === 'Rejected'">
                        {{ dataService.evaluationResults.finalDecision.decision }}
                    </div>

                    <div class="ratings">
                        <div class="rating-item">
                            <div class="rating-label">Technical Skills</div>
                            <div class="rating-stars">
                                <span *ngFor="let star of [1,2,3,4,5]" 
                                      [class.filled]="star <= dataService.evaluationResults.finalDecision.ratings['Technical Skills']">
                                    ★
                                </span>
                            </div>
                        </div>

                        <div class="rating-item">
                            <div class="rating-label">Cultural Fit</div>
                            <div class="rating-stars">
                                <span *ngFor="let star of [1,2,3,4,5]" 
                                      [class.filled]="star <= dataService.evaluationResults.finalDecision.ratings['Communication Skills']">
                                    ★
                                </span>
                            </div>
                        </div>

                        <div class="rating-item">
                            <div class="rating-label">Experience Level</div>
                            <div class="rating-stars">
                                <span *ngFor="let star of [1,2,3,4,5]" 
                                      [class.filled]="star <= dataService.evaluationResults.finalDecision.ratings['Experience Level']">
                                    ★
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Footer -->
            <div class="footer">
                <div class="logo">
                    <i class="fas fa-robot"></i>
                    HireAI
                </div>
                <div class="social-links">
                    <a href="#" target="_blank"><i class="fab fa-twitter"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-linkedin"></i></a>
                    <a href="#" target="_blank"><i class="fab fa-github"></i></a>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .results-container {
            max-width: 1200px;
            margin: 40px auto;
            padding: 32px;
            color: #e2e8f0;
            font-family: 'Inter', sans-serif;
            background: linear-gradient(to bottom, #1a1f36, #111827);
            border-radius: 24px;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        h1, h2 {
            color: white;
            text-align: center;
            margin-bottom: 40px;
            font-size: 32px;
            background: linear-gradient(90deg, #60a5fa, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            font-weight: 600;
        }

        .interview-session {
            background: rgba(21, 30, 51, 0.7);
            border-radius: 20px;
            padding: 32px;
            margin-bottom: 48px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
        }

        .question-progress {
            display: flex;
            align-items: center;
            margin: 20px 0;
        }

        .progress-circle {
            width: 40px;
            height: 40px;
            background: #2563eb;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
        }

        .progress-bar {
            flex: 1;
            height: 4px;
            background: #2563eb;
            margin: 0 15px;
        }

        .question-count {
            color: #94a3b8;
        }

        /* Transcription Styles */
        .transcription-container {
            margin-top: 30px;
            background: rgba(30, 41, 59, 0.5);
            border-radius: 16px;
            padding: 24px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .chat-container {
            max-height: 500px;
            overflow-y: auto;
            padding: 24px;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .message {
            max-width: 80%;
            padding: 16px;
            border-radius: 16px;
            position: relative;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
            transition: transform 0.2s ease;
        }

        .message:hover {
            transform: translateY(-2px);
        }

        .ai-message {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
            align-self: flex-start;
            margin-right: auto;
        }

        .candidate-message {
            background: rgba(55, 65, 81, 0.7);
            align-self: flex-end;
            margin-left: auto;
            backdrop-filter: blur(10px);
        }

        .message-header {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 10px;
            font-size: 0.9em;
            color: rgba(255, 255, 255, 0.9);
        }

        .message-content {
            line-height: 1.6;
            color: #f8fafc;
        }

        .evaluation-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
            margin-top: 40px;
        }

        .analysis-card, .decision-card {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 20px;
            padding: 32px;
            border: 1px solid rgba(255, 255, 255, 0.05);
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
            backdrop-filter: blur(10px);
        }

        h3 {
            color: #60a5fa;
            margin-bottom: 24px;
            font-size: 24px;
            font-weight: 600;
        }

        h4 {
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
            margin: 20px 0;
            font-size: 18px;
        }

        .plus-icon {
            color: #22c55e;
            font-size: 20px;
        }

        .arrow-icon {
            color: #f59e0b;
            font-size: 20px;
        }

        ul {
            list-style: none;
            padding: 0;
        }

        li {
            margin: 12px 0;
            padding-left: 28px;
            position: relative;
            line-height: 1.6;
            color: #e2e8f0;
        }

        li:before {
            content: "•";
            position: absolute;
            left: 10px;
            color: #60a5fa;
        }

        .decision-status {
            text-align: center;
            font-size: 28px;
            font-weight: bold;
            padding: 16px;
            border-radius: 12px;
            margin: 24px 0;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }

        .decision-status.accepted {
            background: rgba(34, 197, 94, 0.1);
            color: #22c55e;
            border: 1px solid rgba(34, 197, 94, 0.2);
        }

        .decision-status.rejected {
            background: rgba(239, 68, 68, 0.1);
            color: #ef4444;
            border: 1px solid rgba(239, 68, 68, 0.2);
        }

        .ratings {
            display: flex;
            flex-direction: column;
            gap: 20px;
        }

        .rating-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 10px;
            border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .rating-label {
            color: #e2e8f0;
            font-size: 16px;
            font-weight: 500;
        }

        .rating-stars {
            color: #475569;
            font-size: 24px;
            letter-spacing: 2px;
        }

        .rating-stars span.filled {
            color: #3b82f6;
            text-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
        }

        .footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 48px;
            padding-top: 24px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo {
            display: flex;
            align-items: center;
            gap: 12px;
            font-weight: 600;
            font-size: 20px;
            color: #60a5fa;
        }

        .social-links {
            display: flex;
            gap: 20px;
        }

        .social-links a {
            color: #64748b;
            font-size: 24px;
            text-decoration: none;
            transition: all 0.3s ease;
        }

        .social-links a:hover {
            color: #3b82f6;
            transform: translateY(-2px);
        }

        /* Scrollbar Styles */
        ::-webkit-scrollbar {
            width: 8px;
            height: 8px;
        }

        ::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb {
            background: rgba(59, 130, 246, 0.3);
            border-radius: 4px;
            border: 2px solid rgba(30, 41, 59, 0.5);
        }

        ::-webkit-scrollbar-thumb:hover {
            background: rgba(59, 130, 246, 0.5);
        }

        @media (max-width: 768px) {
            .evaluation-grid {
                grid-template-columns: 1fr;
            }

            .results-container {
                padding: 20px;
                margin: 20px;
            }
        }
    `]
})
export class InterviewResultsComponent {
    constructor(public dataService: DataService, private router: Router) {
        // Redirect to interview page if no results are available
        if (!this.dataService.evaluationResults) {
            this.router.navigate(['/ai-interview']);
        }
    }
} 