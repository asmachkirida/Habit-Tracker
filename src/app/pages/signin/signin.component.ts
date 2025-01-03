import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http'; // Import HttpClient for API requests
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs'; // To handle errors gracefully
import { jwtDecode } from 'jwt-decode'; // Import the jwt-decode library

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {
  signinForm: FormGroup;
  hide = true;
  isLoading = false; // Track loading state
  loginError: string | null = null; // Store login error message

  apiUrl = 'http://77.37.86.136:8002/authentication/individual/default'; // API URL

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient // Inject HttpClient to make HTTP requests
  ) {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  togglePasswordVisibility(): void {
    this.hide = !this.hide;
  }

  onSubmit(): void {
    if (this.signinForm.valid) {
      const { email, password } = this.signinForm.value;

      // Prepare the login data
      const loginData = { email, password };

      this.isLoading = true; // Set loading state to true

      // Send the POST request to the API
      this.http.post<any>(this.apiUrl, loginData).pipe(
        catchError(error => {
          console.error('Login failed:', error);
          this.loginError = 'Login failed. Please check your credentials.'; // Set error message
          this.isLoading = false; // Reset loading state
          return of(null); // Return null if there's an error
        })
      ).subscribe(response => {
        this.isLoading = false; // Reset loading state

        if (response) {
          // Save tokens if login is successful
          const { accessToken, refreshToken } = response;
          
          // Store email and tokens in localStorage
          localStorage.setItem('mail', email);
          localStorage.setItem('password', password);

          localStorage.setItem('authToken', accessToken);
          localStorage.setItem('refreshToken', refreshToken);
          
          // Decode the access token to extract the user ID (sub)
          const decodedToken = jwtDecode(accessToken);
          const userId = decodedToken.sub;

          // Ensure the userId is defined before storing it in localStorage
          if (userId) {
            localStorage.setItem('userId', userId);
          } else {
            console.error('User ID (sub) is undefined.');
          }

          // Display the contents of localStorage to verify
          console.log('LocalStorage:', localStorage);

          // Redirect to /ode-solver after successful login
          this.router.navigate(['/habit']);
        }
      });
    }
  }


  
}
