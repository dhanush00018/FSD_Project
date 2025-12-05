import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobService, Application } from '../../services/job.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container py-4">
      <h2 class="mb-4"><i class="bi bi-file-earmark-text me-2"></i>My Applications</h2>

      @if (loading) {
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (applications.length === 0) {
        <div class="empty-state">
          <i class="bi bi-inbox"></i>
          <h4>No applications yet</h4>
          <p>Start exploring jobs and apply for positions you're interested in</p>
          <a routerLink="/jobs" class="btn btn-primary">Browse Jobs</a>
        </div>
      } @else {
        <div class="row g-4">
          @for (app of applications; track app.job.id) {
            <div class="col-md-6">
              <div class="card h-100">
                <div class="card-body">
                  <div class="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 class="card-title mb-1">{{ app.job.title }}</h5>
                      <p class="company-info mb-1">
                        <i class="bi bi-building me-1"></i>{{ app.job.company }}
                      </p>
                      <p class="job-meta mb-0">
                        <i class="bi bi-geo-alt me-1"></i>{{ app.job.location }}
                      </p>
                    </div>
                    <span class="badge" [class]="getStatusBadgeClass(app.status)">
                      {{ app.status }}
                    </span>
                  </div>
                </div>
                <div class="card-footer bg-transparent">
                  <small class="text-muted">
                    <i class="bi bi-clock me-1"></i>Applied {{ app.appliedAt | date:'medium' }}
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
export class MyApplicationsComponent implements OnInit {
  applications: Application[] = [];
  loading = true;

  constructor(private jobService: JobService) {}

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    this.jobService.getMyApplications().subscribe({
      next: (response) => {
        this.applications = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading applications:', err);
        this.loading = false;
      }
    });
  }

  getStatusBadgeClass(status: string): string {
    switch (status) {
      case 'accepted': return 'bg-success';
      case 'rejected': return 'bg-danger';
      case 'reviewed': return 'bg-info';
      default: return 'bg-secondary';
    }
  }
}
