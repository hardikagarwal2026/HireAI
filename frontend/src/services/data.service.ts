import { Injectable } from '@angular/core';

export interface Message {
    speaker: 'AI_HR' | 'Candidate';
    text: string;
}

export interface Transcription {
    conversation: Message[];
    error?: string;
}

@Injectable({ providedIn: 'root' })
export class DataService {
    public sharedText: string = '';
    public interview: any = null;
    public job: string = '';
    public summary: string = '';
    public phoneNumber: string = '';
    public evaluationResults: any = null;
    public transcription: Transcription = {
        conversation: []
    };

    constructor() {}

    // Method to update transcription
    setTranscription(data: Transcription) {
        this.transcription = data;
    }

    // Method to clear transcription
    clearTranscription() {
        this.transcription = {
            conversation: []
        };
    }
}
