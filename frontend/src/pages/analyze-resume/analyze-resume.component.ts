import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-analyze-resume',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './analyze-resume.component.html',
  styleUrls: ['./analyze-resume.component.css']
})
export class AnalyzeResumeComponent implements OnInit {
  fullData: any = null;
  showInterviewSection: boolean = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private dataService: DataService
  ) { }

  ngOnInit(): void {
    const checkInterval = setInterval(() => {
      if (this.dataService.interview) {
        this.fullData = this.dataService.interview;
        this.showInterviewSection = true;
        clearInterval(checkInterval);
      }
    }, 500);

    this.fullData = this.dataService.interview;
  }

  redirectToAiInterview(): void {
    if (!this.fullData || !this.fullData.analysis) {
      console.warn("⚠️ Data not available yet.");
      return;
    }

    const jobData = {
      summary: this.fullData.analysis.summary,
      candidate_name: this.fullData.analysis.name,
      job_role: this.fullData.role,
      phone_no: this.fullData.analysis.phone_no,
      questions: this.fullData.analysis.questions
    };

    this.dataService.summary = jobData.summary;
    this.dataService.phoneNumber = jobData.phone_no;

    console.log("🚀 Redirecting to AI Interview with data:", jobData);

    this.http.post('http://localhost:4000/api/interview', jobData).subscribe(
      (response: any) => {
        console.log("✅ Server response:", response);
        this.router.navigate(['/ai-interview']);
      },
      (error: any) => {
        console.error("❌ Error submitting job data:", error);
      }
    );
  }
}
