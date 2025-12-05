import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      <h2 class="mb-4"><i class="bi bi-briefcase me-2"></i>Browse Jobs</h2>
      
      <div class="card mb-4">
        <div class="card-body">
          <div class="row g-3">
            <div class="col-md-4">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Search jobs..."
                [(ngModel)]="searchTerm"
                (keyup.enter)="loadJobs()"
              >
            </div>
            <div class="col-md-3">
              <select class="form-select" [(ngModel)]="jobType" (change)="loadJobs()">
                <option value="">All Types</option>
                <option value="full-time">Full-time</option>
                <option value="part-time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
                <option value="remote">Remote</option>
              </select>
            </div>
            <div class="col-md-3">
              <input 
                type="text" 
                class="form-control" 
                placeholder="Location..."
                [(ngModel)]="location"
                (keyup.enter)="loadJobs()"
              >
            </div>
            <div class="col-md-2">
              <button class="btn btn-primary w-100" (click)="loadJobs()">
                <i class="bi bi-search me-1"></i>Search
              </button>
            </div>
          </div>
        </div>
      </div>

      @if (loading) {
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (jobs.length === 0) {
        <div class="empty-state">
          <i class="bi bi-inbox"></i>
          <h4>No jobs found</h4>
          <p>Try adjusting your search criteria</p>
        </div>
      } @else {
        <div class="row g-4">
          @for (job of jobs; track job._id) {
            <div class="col-md-6 col-lg-4">
              <div class="card job-card h-100" [routerLink]="['/jobs', job._id]">
                <div class="card-body">
                  <span class="badge bg-primary badge-job-type mb-2">{{ job.jobType }}</span>
                  <h5 class="card-title">{{ job.title }}</h5>
                  <p class="company-info mb-2">
                    <i class="bi bi-building me-1"></i>{{ job.company }}
                  </p>
                  <p class="job-meta mb-2">
                    <i class="bi bi-geo-alt me-1"></i>{{ job.location }}
                  </p>
                  @if (job.salary && job.salary !== 'Not specified') {
                    <p class="salary-tag mb-2">
                      <i class="bi bi-currency-dollar"></i>{{ job.salary }}
                    </p>
                  }
                  <p class="text-muted small mb-0">
                    <i class="bi bi-clock me-1"></i>Posted {{ getTimeAgo(job.createdAt) }}
                  </p>
                </div>
                <div class="card-footer bg-transparent">
                  <small class="text-muted">
                    <i class="bi bi-people me-1"></i>{{ job.applicants?.length || 0 }} applicants
                  </small>
                </div>
              </div>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class JobListComponent implements OnInit {
  jobs: Job[] = [];
  loading = false;
  searchTerm = '';
  jobType = '';
  location = '';

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.loading = true;
    this.jobService.getJobs({
      search: this.searchTerm,
      jobType: this.jobType,
      location: this.location
    }).subscribe({
      next: (response) => {
        this.jobs = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading jobs:', err);
        this.loading = false;
      }
    });
  }

  getTimeAgo(date: string): string {
    const now = new Date();
    const posted = new Date(date);
    const diffInHours = Math.floor((now.getTime() - posted.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays}d ago`;
    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths}mo ago`;
  }
}
