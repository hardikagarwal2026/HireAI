import { Routes } from '@angular/router';
import { LandingPageComponent } from '../pages/landing-page/landing-page.component';
import { AnalyzeResumeComponent } from '../pages/analyze-resume/analyze-resume.component';
import { AiInterviewComponent } from '../pages/ai-interview/ai-interview.component';
import { InterviewResultsComponent } from '../pages/interview-results/interview-results.component';

export const routes: Routes = [
    { path: '', redirectTo: 'landing', pathMatch: 'full' },
    { path: 'landing', component: LandingPageComponent },
    { path: 'analyze-resume', component: AnalyzeResumeComponent },
    { path: 'ai-interview', component: AiInterviewComponent },
    { path: 'interview-results', component: InterviewResultsComponent }
];
