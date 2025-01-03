import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';  // Import HttpClient
import { Observable } from 'rxjs';
import { Router } from '@angular/router';  // Import Router for navigation

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  signupForm: FormGroup;
  hide = true;
  apiUrl = 'http://77.37.86.136:8002/account/individual/default-method/create';  // Replace with your actual API URL

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    // Initialize the form group with the required fields
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      gender: ['', Validators.required],
      birthDate: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  // Toggle password visibility
  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  // Handle form submission
  onSubmit() {
    if (this.signupForm.valid) {
      const formData = this.signupForm.value;

      // Map the form data to match the API's expected payload structure
      const apiPayload = {
        idAccount: 1, // You can adjust this as necessary
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        gender: formData.gender, // API expects 'gender' instead of 'sex'
        birthdate: formData.birthDate, // API expects 'birthdate' instead of 'birthDate'
        password: formData.password
      };

      // Display the data in the console before sending
      console.log('API Payload:', apiPayload);

      // Store sensitive data in localStorage for later use
      localStorage.setItem('mdp', formData.password);
      localStorage.setItem('mail', formData.email);

      // Call the API directly in the component
      this.signupUser(apiPayload).subscribe({
        next: (response) => {
          console.log('User signed up successfully', response);

          // Handle successful response
          alert('Signup successful! Please check your email address to activate your account!');

          // Redirect to signin page
          this.router.navigate(['/signin']);
        },
        error: (error) => {
          console.error('Error during signup', error);
          // Handle error, e.g., display an error message to the user
          alert('Signup failed. Please try again.');
        }
      });
    } else {
      alert('Please fill out all required fields correctly.');
    }
  }

  // API call method within the component
  signupUser(signupData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, signupData);
  }
}
