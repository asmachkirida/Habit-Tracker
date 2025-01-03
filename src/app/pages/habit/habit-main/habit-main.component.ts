import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-habit-main',
  templateUrl: './habit-main.component.html',
  styleUrls: ['./habit-main.component.css'],
})
export class HabitMainComponent implements OnInit {
  isProfileModalOpen = false;
  fullName: string = '';
  birthDate: string = '';
  email: string = '';

  constructor(private router: Router, private http: HttpClient) {}

  ngOnInit(): void {
    const authToken = localStorage.getItem('authToken');
    if (authToken) {
      const headers = new HttpHeaders({
        Authorization: `Bearer ${authToken}`,
      });

      this.http
        .get('http://77.37.86.136:8002/account/individual/default-method/read', { headers })
        .subscribe(
          (response: any) => {
            this.fullName = `${response.firstName} ${response.lastName}`;
            this.birthDate = response.birthdate;
            this.email = response.email;
            
            const firstName = response.firstName;
            localStorage.setItem('firstName', firstName);

          },
          (error) => {
            console.error('Error fetching user data:', error);
          }
        );
    } else {
      console.error('Auth token is missing!');
    }
  }

  openProfileModal() {
    this.isProfileModalOpen = true;
  }

  closeProfileModal() {
    console.log('Modal closed');
    this.isProfileModalOpen = false;
  }

  logout() {
    localStorage.clear();
    this.router.navigate(['/signin']);
  }
}
