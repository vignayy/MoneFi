import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { Router, RouterModule } from '@angular/router';
import { Component } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';


@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule,NgChartsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  email: string = '';
  verificationCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // Component state
  stage: 'email' | 'verification' | 'reset' = 'email';
  
  // Message handling
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient,private router:Router) {}

  public radarChartData: ChartData<'radar'> = {
    labels: ['Budgeting', 'Saving', 'Investing', 'Planning', 'Tracking', 'Goals'],
    datasets: [
      {
        label: 'Current Status',
        data: [65, 59, 90, 81, 56, 55],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
      },
      {
        label: 'Target Status',
        data: [28, 48, 40, 19, 96, 27],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
      }
    ]
  };

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Financial Health Analysis',
        font: {
          size: 18,
          family: 'Roboto',
        },
        color: '#1e3c72',
      }
    },
    scales: {
      r: {
        ticks: {
          display: false, // Hide the numbers on the scale
        },
        angleLines: {
          display: true, // Keep the radial axis lines
        },
      }
    }
  };


  // Email submission stage
  sendVerificationCode() {
    // Reset previous messages
    this.clearMessages();

    // Validate email format (basic client-side validation)
    if (!this.isValidEmail(this.email)) {
      this.errorMessage = 'Please enter a valid email address';
      return;
    }

    // Make API call to send verification code
    this.http.post(`http://localhost:8765/auth/forgot-password`, null, { 
      params: { email: this.email },
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.stage = 'verification';
      },
      error: (error: HttpErrorResponse) => {
        // this.successMessage='Successfully sent';
        // this.stage='verification';
        alert('cant send email');
      }
    });
  }

  // Verification code stage
  verifyCode() {
    // Reset previous messages
    this.clearMessages();

    // Validate code length
    if (this.verificationCode.length !== 6) {
      this.errorMessage = 'Verification code must be 6 digits';
      return;
    }

    // Make API call to verify code
    this.http.post(`http://localhost:8765/auth/verify-code`, null, { 
      params: { 
        email: this.email,
        code: this.verificationCode 
      },
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.successMessage = response;
        this.stage = 'reset';
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = 'Invalid verification code';
        // this.stage='verification';
      }
    });
  }

  // Password reset stage
  resetPassword() {
    // Reset previous messages
    this.clearMessages();

    // Validate password
    if (!this.validatePassword()) {
      return;
    }

    // Make API call to reset password
    this.http.put(`http://localhost:8765/auth/update-password`, null, { 
      params: { 
        email: this.email,
        password: this.newPassword 
      },
      responseType: 'text'
    }).subscribe({
      next: (response) => {
        this.successMessage = response;
        // Optional: Reset form or navigate to login
        this.resetForm();
        
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error || 'Failed to reset password';
      }
    });
  }

  // Password validation
  private validatePassword(): boolean {
    // Check if passwords match
    if (this.newPassword !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return false;
    }

    // Basic password strength check
    if (this.newPassword.length < 6) {
      this.errorMessage = 'Password must be at least 8 characters long';
      return false;
    }

    return true;
  }

  // Email validation
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Reset form and component state
  private resetForm() {
    this.email = '';
    this.verificationCode = '';
    this.newPassword = '';
    this.confirmPassword = '';
    this.stage = 'email';
  }

  // Clear error and success messages
  private clearMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

}



