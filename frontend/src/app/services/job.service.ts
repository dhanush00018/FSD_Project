import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Job {
  _id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  jobType: 'full-time' | 'part-time' | 'contract' | 'internship' | 'remote';
  requirements: string[];
  employer: {
    _id: string;
    name: string;
    email: string;
  };
  applicants: Applicant[];
  createdAt: string;
}

export interface Applicant {
  user: {
    _id: string;
    name: string;
    email: string;
  };
  appliedAt: string;
  coverLetter: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'rejected';
}

export interface JobsResponse {
  success: boolean;
  count: number;
  data: Job[];
}

export interface JobResponse {
  success: boolean;
  data: Job;
}

export interface Application {
  job: {
    id: string;
    title: string;
    company: string;
    location: string;
    employer: {
      name: string;
      email: string;
    };
  };
  appliedAt: string;
  status: string;
}

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getJobs(filters?: { search?: string; jobType?: string; location?: string }): Observable<JobsResponse> {
    let params = new HttpParams();
    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.jobType) {
      params = params.set('jobType', filters.jobType);
    }
    if (filters?.location) {
      params = params.set('location', filters.location);
    }
    return this.http.get<JobsResponse>(`${this.apiUrl}/jobs`, { params });
  }

  getJobById(id: string): Observable<JobResponse> {
    return this.http.get<JobResponse>(`${this.apiUrl}/jobs/${id}`);
  }

  createJob(job: Partial<Job>): Observable<JobResponse> {
    return this.http.post<JobResponse>(`${this.apiUrl}/jobs`, job);
  }

  deleteJob(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/jobs/${id}`);
  }

  applyForJob(id: string, coverLetter?: string): Observable<{ success: boolean; message: string }> {
    return this.http.post<{ success: boolean; message: string }>(`${this.apiUrl}/jobs/${id}/apply`, {
      coverLetter
    });
  }

  getMyJobs(): Observable<JobsResponse> {
    return this.http.get<JobsResponse>(`${this.apiUrl}/jobs/my-jobs`);
  }

  getMyApplications(): Observable<{ success: boolean; count: number; data: Application[] }> {
    return this.http.get<{ success: boolean; count: number; data: Application[] }>(`${this.apiUrl}/jobs/my-applications`);
  }
}
