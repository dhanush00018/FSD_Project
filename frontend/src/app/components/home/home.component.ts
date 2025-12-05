import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="hero-section">
      <div class="container text-center">
        <h1 class="display-4 fw-bold mb-4">Find Your Dream Job Today</h1>
        <p class="lead mb-4">Connect with top employers and discover opportunities that match your skills</p>
        <div class="d-flex justify-content-center gap-3">
          <a routerLink="/jobs" class="btn btn-light btn-lg">
            <i class="bi bi-search me-2"></i>Browse Jobs
          </a>
          @if (!authService.isLoggedIn()) {
            <a routerLink="/register" class="btn btn-outline-light btn-lg">
              <i class="bi bi-person-plus me-2"></i>Get Started
            </a>
          }
        </div>
      </div>
    </div>

    <div class="container py-5">
      <div class="row g-4">
        <div class="col-md-4">
          <div class="card h-100 text-center p-4">
            <div class="card-body">
              <i class="bi bi-briefcase-fill text-primary display-4 mb-3"></i>
              <h5 class="card-title">Find Jobs</h5>
              <p class="card-text text-muted">Browse thousands of job listings from top companies</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 text-center p-4">
            <div class="card-body">
              <i class="bi bi-person-check-fill text-success display-4 mb-3"></i>
              <h5 class="card-title">Easy Apply</h5>
              <p class="card-text text-muted">Apply to jobs with just one click and track your applications</p>
            </div>
          </div>
        </div>
        <div class="col-md-4">
          <div class="card h-100 text-center p-4">
            <div class="card-body">
              <i class="bi bi-building text-info display-4 mb-3"></i>
              <h5 class="card-title">Post Jobs</h5>
              <p class="card-text text-muted">Employers can post jobs and find qualified candidates</p>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-5 text-center">
        <h2 class="mb-4">Ready to Get Started?</h2>
        <div class="row justify-content-center">
          <div class="col-md-6">
            <div class="card">
              <div class="card-body p-4">
                <h5>Looking for a job?</h5>
                <p class="text-muted">Create an account and start applying today</p>
                @if (!authService.isLoggedIn()) {
                  <a routerLink="/register" class="btn btn-primary">Register as Job Seeker</a>
                } @else {
                  <a routerLink="/jobs" class="btn btn-primary">Browse Jobs</a>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class HomeComponent {
  constructor(public authService: AuthService) {}
}
