import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnalyzeResumeComponent } from './analyze-resume.component';

describe('AnalyzeResumeComponent', () => {
  let component: AnalyzeResumeComponent;
  let fixture: ComponentFixture<AnalyzeResumeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyzeResumeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyzeResumeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
