import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthApiService } from '../auth-api.service';
import { LoginCredentials } from '../model/LoginCredentials';
import { HeaderComponent } from '../header/header.component';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, HeaderComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  showPassword = false;

  constructor(private fb: FormBuilder, private router: Router, private authApiService:AuthApiService, private toastr:ToastrService) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }

  goToForgotPassword() {
    // Add your forgot password navigation or modal logic here
    console.log('Forgot password clicked');
  }

  onSubmit(loginCredentials:LoginCredentials) {
      // console.log('Login form submitted:', loginCredentials);
      this.authApiService.loginApiFunction(loginCredentials)
      .subscribe (
        response=>{
          // console.log(response);
          sessionStorage.setItem('finance.auth',response.jwtToken);
          this.toastr.success('Login successful', 'Success');
          this.router.navigate(['dashboard']);
        },
        error=>{
          // console.error('Login Failed', error);
          // this.toastr.error('Invalid username or password', 'Login failed');
          if (error.status === 404) {
            this.toastr.error('User not found. Please sign up.', 'Login Failed');
          } else if (error.status === 401) {
            this.toastr.error('Invalid username or password', 'Login Failed');
          } else {
            console.error('Login Failed', error);
            this.toastr.error('An error occurred. Please try again.', 'Login Failed');
          }
        }
      )
  }


  
}