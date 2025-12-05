import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from '../../services/job.service';

@Component({
  selector: 'app-job-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h4 class="mb-0"><i class="bi bi-plus-circle me-2"></i>Post a New Job</h4>
            </div>
            <div class="card-body p-4">
              @if (error) {
                <div class="alert alert-danger">{{ error }}</div>
              }

              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="title" class="form-label">Job Title *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="title"
                    [(ngModel)]="job.title"
                    name="title"
                    required
                    placeholder="e.g., Senior Software Engineer"
                  >
                </div>

                <div class="mb-3">
                  <label for="company" class="form-label">Company Name *</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="company"
                    [(ngModel)]="job.company"
                    name="company"
                    required
                    placeholder="e.g., Tech Corp Inc."
                  >
                </div>

                <div class="row">
                  <div class="col-md-6 mb-3">
                    <label for="location" class="form-label">Location *</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="location"
                      [(ngModel)]="job.location"
                      name="location"
                      required
                      placeholder="e.g., New York, NY"
                    >
                  </div>
                  <div class="col-md-6 mb-3">
                    <label for="salary" class="form-label">Salary Range</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="salary"
                      [(ngModel)]="job.salary"
                      name="salary"
                      placeholder="e.g., $80,000 - $120,000"
                    >
                  </div>
                </div>

                <div class="mb-3">
                  <label for="jobType" class="form-label">Job Type *</label>
                  <select class="form-select" id="jobType" [(ngModel)]="job.jobType" name="jobType">
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                    <option value="internship">Internship</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div class="mb-3">
                  <label for="description" class="form-label">Job Description *</label>
                  <textarea 
                    class="form-control" 
                    id="description"
                    [(ngModel)]="job.description"
                    name="description"
                    rows="6"
                    required
                    placeholder="Describe the role, responsibilities, and what you're looking for..."
                  ></textarea>
                </div>

                <div class="mb-3">
                  <label for="requirements" class="form-label">Requirements (one per line)</label>
                  <textarea 
                    class="form-control" 
                    id="requirements"
                    [(ngModel)]="requirementsText"
                    name="requirements"
                    rows="4"
                    placeholder="5+ years of experience&#10;Bachelor's degree in CS&#10;Strong communication skills"
                  ></textarea>
                </div>

                <div class="d-flex gap-2">
                  <button type="submit" class="btn btn-primary" [disabled]="loading">
                    @if (loading) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                    }
                    <i class="bi bi-check-circle me-2"></i>Post Job
                  </button>
                  <button type="button" class="btn btn-outline-secondary" (click)="cancel()">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class JobPostComponent {
  job = {
    title: '',
    company: '',
    location: '',
    salary: '',
    jobType: 'full-time' as const,
    description: ''
  };
  requirementsText = '';
  error = '';
  loading = false;

  constructor(private jobService: JobService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    const requirements = this.requirementsText
      .split('\n')
      .map(r => r.trim())
      .filter(r => r.length > 0);

    this.jobService.createJob({
      ...this.job,
      requirements
    }).subscribe({
      next: (response) => {
        this.loading = false;
        this.router.navigate(['/jobs', response.data._id]);
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Failed to post job. Please try again.';
      }
    });
  }

  cancel() {
    this.router.navigate(['/jobs']);
  }
}
