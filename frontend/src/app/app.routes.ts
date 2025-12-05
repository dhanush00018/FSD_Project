import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { JobListComponent } from './components/job-list/job-list.component';
import { JobDetailComponent } from './components/job-detail/job-detail.component';
import { JobPostComponent } from './components/job-post/job-post.component';
import { MyJobsComponent } from './components/my-jobs/my-jobs.component';
import { MyApplicationsComponent } from './components/my-applications/my-applications.component';
import { authGuard, employerGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'jobs', component: JobListComponent },
  { path: 'jobs/:id', component: JobDetailComponent },
  { path: 'post-job', component: JobPostComponent, canActivate: [employerGuard] },
  { path: 'my-jobs', component: MyJobsComponent, canActivate: [employerGuard] },
  { path: 'my-applications', component: MyApplicationsComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];
