import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <div class="container">
        <a class="navbar-brand" routerLink="/">
          <i class="bi bi-briefcase-fill me-2"></i>Job Portal
        </a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav me-auto">
            <li class="nav-item">
              <a class="nav-link" routerLink="/jobs" routerLinkActive="active">
                <i class="bi bi-search me-1"></i>Browse Jobs
              </a>
            </li>
            @if (authService.isEmployer()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/post-job" routerLinkActive="active">
                  <i class="bi bi-plus-circle me-1"></i>Post Job
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/my-jobs" routerLinkActive="active">
                  <i class="bi bi-list-ul me-1"></i>My Jobs
                </a>
              </li>
            }
            @if (authService.isLoggedIn() && !authService.isEmployer()) {
              <li class="nav-item">
                <a class="nav-link" routerLink="/my-applications" routerLinkActive="active">
                  <i class="bi bi-file-earmark-text me-1"></i>My Applications
                </a>
              </li>
            }
          </ul>
          <ul class="navbar-nav">
            @if (authService.isLoggedIn()) {
              <li class="nav-item">
                <span class="nav-link text-light">
                  <i class="bi bi-person-circle me-1"></i>{{ authService.currentUser?.name }}
                  <span class="badge bg-light text-primary ms-1">{{ authService.currentUser?.role }}</span>
                </span>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#" (click)="logout($event)">
                  <i class="bi bi-box-arrow-right me-1"></i>Logout
                </a>
              </li>
            } @else {
              <li class="nav-item">
                <a class="nav-link" routerLink="/login" routerLinkActive="active">
                  <i class="bi bi-box-arrow-in-right me-1"></i>Login
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" routerLink="/register" routerLinkActive="active">
                  <i class="bi bi-person-plus me-1"></i>Register
                </a>
              </li>
            }
          </ul>
        </div>
      </div>
    </nav>
    <main>
      <router-outlet></router-outlet>
    </main>
    <footer class="bg-dark text-light py-4 mt-5">
      <div class="container text-center">
        <p class="mb-0">Job Portal - Find Your Dream Job Today</p>
      </div>
    </footer>
  `
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router) {}

  logout(event: Event) {
    event.preventDefault();
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
