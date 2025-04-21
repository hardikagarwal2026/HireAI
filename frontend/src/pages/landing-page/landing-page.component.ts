import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // ✅ Import this
import { FormsModule } from '@angular/forms';
import { DataService } from '../../services/data.service'; // ✅ Import the service
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing-page',
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'] // ❗️styleUrl → styleUrls
})
export class LandingPageComponent {

  fileName: string = '';
  selectedFile: File | null = null;
  jobRole: string = '';
  requiredSkills: string = '';
  experienceLevel: string = '';
  globalTextData: string = '';
  interviewResult: any = null;


  constructor(private router: Router, private http: HttpClient, private dataService: DataService) { } // ✅ Inject here


  triggerFileInput() {
    const fileInput = document.getElementById('resumeUpload') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      const file = input.files[0];
      this.selectedFile = file;
      this.fileName = ` ${file.name}`;
      this.uploadFile(); // Trigger upload
    } else {
      this.fileName = '';
    }
  }

  uploadFile() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('resume', this.selectedFile);

    this.http.post('http://localhost:4000/api/upload', formData).subscribe(
      (response: any) => {
        this.globalTextData = response.text;
        this.dataService.sharedText = this.globalTextData; // Store the text in the service
        this.dataService.job = this.jobRole; // Store the text in the service
        
        console.log("📄 Extracted Resume Text:", this.globalTextData);
      },
      (error: any) => {
        console.error('❌ Upload error:', error);
      }
    );
  }

  redirectToAnalyzeResume(): void {
    const jobData = {
      text: this.globalTextData,
      role: this.jobRole,
      requiredSkills: this.requiredSkills ? this.requiredSkills.split(',').map(skill => skill.trim()) : [],
      experienceLevel: this.experienceLevel
    };

    this.http.post('http://localhost:4000/api/analyze', jobData).subscribe(
      (response: any) => {
        this.dataService.interview = response;
        this.interviewResult = response;
        console.log("📄 Analysis Response:", this.dataService.interview);
      },
      (error: any) => {
        console.error("❌ Error submitting job data:", error);
      }
    );
    this.router.navigate(['/analyze-resume']);
  }
}
