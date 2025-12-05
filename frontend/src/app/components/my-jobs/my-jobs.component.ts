import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService, Job } from '../../services/job.service';

@Component({
  selector: 'app-my-jobs',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2><i class="bi bi-list-ul me-2"></i>My Job Postings</h2>
        <a routerLink="/post-job" class="btn btn-primary">
          <i class="bi bi-plus-circle me-2"></i>Post New Job
        </a>
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
          <h4>No job postings yet</h4>
          <p>Start by posting your first job</p>
          <a routerLink="/post-job" class="btn btn-primary">Post a Job</a>
        </div>
      } @else {
        <div class="table-responsive">
          <table class="table table-hover">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Location</th>
                <th>Type</th>
                <th>Applicants</th>
                <th>Posted</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @for (job of jobs; track job._id) {
                <tr>
                  <td>
                    <a [routerLink]="['/jobs', job._id]" class="text-decoration-none fw-bold">
                      {{ job.title }}
                    </a>
                  </td>
                  <td>{{ job.company }}</td>
                  <td>{{ job.location }}</td>
                  <td>
                    <span class="badge bg-primary">{{ job.jobType }}</span>
                  </td>
                  <td>
                    <span class="badge bg-secondary">{{ job.applicants?.length || 0 }}</span>
                  </td>
                  <td>{{ job.createdAt | date:'shortDate' }}</td>
                  <td>
                    <div class="btn-group btn-group-sm">
                      <a [routerLink]="['/jobs', job._id]" class="btn btn-outline-primary">
                        <i class="bi bi-eye"></i>
                      </a>
                      <button class="btn btn-outline-danger" (click)="deleteJob(job)">
                        <i class="bi bi-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `
})
export class MyJobsComponent implements OnInit {
  jobs: Job[] = [];
  loading = true;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getMyJobs().subscribe({
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

  deleteJob(job: Job) {
    if (!confirm(`Are you sure you want to delete "${job.title}"?`)) return;
    
    this.jobService.deleteJob(job._id).subscribe({
      next: () => {
        this.jobs = this.jobs.filter(j => j._id !== job._id);
      },
      error: (err) => {
        console.error('Error deleting job:', err);
        alert(err.error?.message || 'Failed to delete job');
      }
    });
  }
}
