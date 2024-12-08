import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SignupCredentials } from '../model/SignupCredentials';
import { AuthApiService } from '../auth-api.service';
import { HttpClient } from '@angular/common/http';
import { UserProfile } from '../model/UserProfile';

import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, NgChartsModule, ToastrModule],
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;

  public mixedChartData: ChartData<'bar' | 'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        type: 'bar',
        label: 'Expenses',
        data: [50, 45, 60, 40, 35, 60, 50, 55, 70, 75, 80, 75],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        type: 'line',
        label: 'Savings',
        data: [60, 55, 65, 50, 45, 70, 63, 67, 90, 95, 90, 85],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
    ],
  };

  public mixedChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      title: {
        display: true,
        text: 'Monthly Finance Overview',
        font: {
          size: 18,
          family: 'Roboto',
        },
        color: '#1e3c72',
      }
    }
  };

  
  constructor(private fb: FormBuilder, private router: Router, private authApiService:AuthApiService, private authClient:HttpClient, private toastr: ToastrService) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordMatchValidator });
  }

  passwordMatchValidator(g: FormGroup) {
    return g.get('password')?.value === g.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  baseUrl = "http://localhost:8765";

  onSubmit(signupCredentials: SignupCredentials) {
    // console.log('Signup form submitted:', signupCredentials);
    this.authApiService.signupApiFunction(signupCredentials)
      .subscribe(
        response => {
          // console.log(response);
          sessionStorage.setItem('finance.auth', response.jwtToken);

          // Get the userId from the API
          this.authClient.get<number>(`${this.baseUrl}/auth/getUserId/${signupCredentials.username}`)
            .subscribe(
              userId => {
                console.log('User ID:', userId);
  
                // Use userId in the next API call
                this.authClient.post<UserProfile>(`${this.baseUrl}/api/user/setDetails/${userId}/${signupCredentials.name}/${signupCredentials.username}`, null)
                  .subscribe(
                    userProfile => {
                      console.log('Profile details:', userProfile);
                      // alert("Registered Successfully! Please login now");
                      this.toastr.success('successfull login', 'Signup success');
                      this.router.navigate(['/login']);
                    },
                    error => {
                      console.error('Failed to save profile details', error);
                    }
                  );
                  sessionStorage.removeItem('finance.auth');
              },
              error => {
                console.error('Failed to fetch User ID', error);
              }
            );
        },
        error => {
          console.error('Signup Failed', error);
          
          // Check if the error response indicates user already exists
          if (error.status === 409) {
            // Show a toast message for existing user
            this.toastr.error('User already exists!', 'Signup Error');
          }
        }
      );
}

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  
  
}