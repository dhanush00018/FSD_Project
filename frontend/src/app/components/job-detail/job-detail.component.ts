import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { JobService, Job } from '../../services/job.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-job-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-4">
      @if (loading) {
        <div class="loading-spinner">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
      } @else if (job) {
        <div class="row">
          <div class="col-lg-8">
            <div class="card mb-4">
              <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <span class="badge bg-primary badge-job-type mb-2">{{ job.jobType }}</span>
                    <h2 class="mb-1">{{ job.title }}</h2>
                    <p class="company-info mb-0">
                      <i class="bi bi-building me-1"></i>{{ job.company }}
                    </p>
                  </div>
                  @if (canDelete()) {
                    <button class="btn btn-outline-danger" (click)="deleteJob()">
                      <i class="bi bi-trash me-1"></i>Delete
                    </button>
                  }
                </div>
                
                <div class="job-meta mb-4">
                  <span class="me-3"><i class="bi bi-geo-alt me-1"></i>{{ job.location }}</span>
                  @if (job.salary && job.salary !== 'Not specified') {
                    <span class="salary-tag"><i class="bi bi-currency-dollar"></i>{{ job.salary }}</span>
                  }
                </div>

                <h5>Job Description</h5>
                <p class="mb-4" style="white-space: pre-line">{{ job.description }}</p>

                @if (job.requirements && job.requirements.length > 0) {
                  <h5>Requirements</h5>
                  <ul>
                    @for (req of job.requirements; track req) {
                      <li>{{ req }}</li>
                    }
                  </ul>
                }
              </div>
            </div>

            @if (isOwner()) {
              <div class="card">
                <div class="card-header">
                  <h5 class="mb-0"><i class="bi bi-people me-2"></i>Applicants ({{ job.applicants?.length || 0 }})</h5>
                </div>
                <div class="card-body">
                  @if (!job.applicants || job.applicants.length === 0) {
                    <p class="text-muted mb-0">No applications yet</p>
                  } @else {
                    <div class="list-group list-group-flush">
                      @for (applicant of job.applicants; track applicant.user._id) {
                        <div class="list-group-item">
                          <div class="d-flex justify-content-between align-items-center">
                            <div>
                              <h6 class="mb-1">{{ applicant.user.name }}</h6>
                              <small class="text-muted">{{ applicant.user.email }}</small>
                            </div>
                            <div class="text-end">
                              <span class="badge" [class]="getStatusBadgeClass(applicant.status)">
                                {{ applicant.status }}
                              </span>
                              <br>
                              <small class="text-muted">{{ applicant.appliedAt | date:'short' }}</small>
                            </div>
                          </div>
                          @if (applicant.coverLetter) {
                            <p class="mt-2 mb-0 small">{{ applicant.coverLetter }}</p>
                          }
                        </div>
                      }
                    </div>
                  }
                </div>
              </div>
            }
          </div>

          <div class="col-lg-4">
            <div class="card sticky-top" style="top: 20px">
              <div class="card-body">
                <h5 class="card-title">Apply for this position</h5>
                
                @if (!authService.isLoggedIn()) {
                  <p class="text-muted">Please login to apply for this job</p>
                  <a routerLink="/login" class="btn btn-primary w-100">
                    <i class="bi bi-box-arrow-in-right me-2"></i>Login to Apply
                  </a>
                } @else if (hasApplied()) {
                  <div class="alert alert-success mb-0">
                    <i class="bi bi-check-circle me-2"></i>You have already applied for this job
                  </div>
                } @else if (isOwner()) {
                  <div class="alert alert-info mb-0">
                    <i class="bi bi-info-circle me-2"></i>This is your job posting
                  </div>
                } @else {
                  @if (applyError) {
                    <div class="alert alert-danger">{{ applyError }}</div>
                  }
                  @if (applySuccess) {
                    <div class="alert alert-success">{{ applySuccess }}</div>
                  }
                  <div class="mb-3">
                    <label class="form-label">Cover Letter (Optional)</label>
                    <textarea 
                      class="form-control" 
                      rows="4"
                      [(ngModel)]="coverLetter"
                      placeholder="Tell the employer why you're a great fit..."
                    ></textarea>
                  </div>
                  <button 
                    class="btn btn-primary w-100" 
                    (click)="applyForJob()"
                    [disabled]="applying"
                  >
                    @if (applying) {
                      <span class="spinner-border spinner-border-sm me-2"></span>
                    }
                    <i class="bi bi-send me-2"></i>Apply Now
                  </button>
                }

                <hr>
                
                <h6>About the Employer</h6>
                <p class="mb-1"><i class="bi bi-person me-2"></i>{{ job.employer?.name }}</p>
                <p class="text-muted mb-0"><i class="bi bi-envelope me-2"></i>{{ job.employer?.email }}</p>
              </div>
            </div>
          </div>
        </div>
      } @else {
        <div class="alert alert-danger">Job not found</div>
      }
    </div>
  `
})
export class JobDetailComponent implements OnInit {
  job: Job | null = null;
  loading = true;
  coverLetter = '';
  applying = false;
  applyError = '';
  applySuccess = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private jobService: JobService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJob(id);
    }
  }

  loadJob(id: string) {
    this.jobService.getJobById(id).subscribe({
      next: (response) => {
        this.job = response.data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading job:', err);
        this.loading = false;
      }
    });
  }

  applyForJob() {
    if (!this.job) return;
    
    this.applying = true;
    this.applyError = '';
    this.applySuccess = '';

    this.jobService.applyForJob(this.job._id, this.coverLetter).subscribe({
      next: (response) => {
        this.applying = false;
        this.applySuccess = response.message;
        this.loadJob(this.job!._id);
      },
      error: (err) => {
        this.applying = false;
        this.applyError = err.error?.message || 'Failed to apply. Please try again.';
      }
    });
  }

  deleteJob() {
    if (!this.job || !confirm('Are you sure you want to delete this job?')) return;
    
    this.jobService.deleteJob(this.job._id).subscribe({
      next: () => {
        this.router.navigate(['/my-jobs']);
      },
      error: (err) => {
        console.error('Error deleting job:', err);
        alert(err.error?.message || 'Failed to delete job');
      }
    });
  }

  isOwner(): boolean {
    return this.job?.employer?._id === this.authService.currentUser?.id;
  }

  canDelete(): boolean {
    return this.isOwner() || this.authService.isAdmin();
  }

  hasApplied(): boolean {
    if (!this.job || !this.authService.currentUser) return false;
    return this.job.applicants?.some(a => a.user._id === this.authService.currentUser?.id) || false;
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
