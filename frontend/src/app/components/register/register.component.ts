import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="container py-5">
      <div class="row justify-content-center">
        <div class="col-md-5">
          <div class="card shadow">
            <div class="card-body p-4">
              <h3 class="text-center mb-4">
                <i class="bi bi-person-plus me-2"></i>Register
              </h3>
              
              @if (error) {
                <div class="alert alert-danger">{{ error }}</div>
              }

              <form (ngSubmit)="onSubmit()">
                <div class="mb-3">
                  <label for="name" class="form-label">Full Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    [(ngModel)]="name" 
                    name="name"
                    required
                    placeholder="Enter your full name"
                  >
                </div>
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    [(ngModel)]="email" 
                    name="email"
                    required
                    placeholder="Enter your email"
                  >
                </div>
                <div class="mb-3">
                  <label for="password" class="form-label">Password</label>
                  <input 
                    type="password" 
                    class="form-control" 
                    id="password" 
                    [(ngModel)]="password" 
                    name="password"
                    required
                    minlength="6"
                    placeholder="At least 6 characters"
                  >
                </div>
                <div class="mb-3">
                  <label for="role" class="form-label">I am a</label>
                  <select class="form-select" id="role" [(ngModel)]="role" name="role">
                    <option value="user">Job Seeker</option>
                    <option value="employer">Employer</option>
                  </select>
                </div>
                <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
                  @if (loading) {
                    <span class="spinner-border spinner-border-sm me-2"></span>
                  }
                  Register
                </button>
              </form>
              
              <div class="text-center mt-3">
                <p class="mb-0">Already have an account? <a routerLink="/login">Login here</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterComponent {
  name = '';
  email = '';
  password = '';
  role = 'user';
  error = '';
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    this.loading = true;
    this.error = '';

    this.authService.register(this.name, this.email, this.password, this.role).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.router.navigate(['/jobs']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err.error?.message || 'Registration failed. Please try again.';
      }
    });
  }
}
