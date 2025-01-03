import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Import HttpClient and HttpHeaders

@Component({
  selector: 'app-profile-modal',
  templateUrl: './profile-modal.component.html',
  styleUrls: ['./profile-modal.component.css']
})
export class ProfileModalComponent implements OnInit {
  @Input() isOpen: boolean = false;
  @Output() closeModal = new EventEmitter<void>();
  

  isEditing: boolean = false;
  userData = {
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    sex: '',
    email: ''
  };
  streakData: any[] = [];
  trophy: string = '';
  streak: number = 0;



  status: 'success' | 'error' = 'success'; // Can be 'error' or 'success'
  statusMessage: string = ''; // Message to display

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchUserData();
    this.fetchStreakAndTrophy();
  }

  fetchUserData(): void {
    // Retrieve the authToken from localStorage
    const authToken = localStorage.getItem('authToken');

    if (!authToken) {
      // Handle the case where there is no token (e.g., redirect to login)
      this.status = 'error';
      this.statusMessage = 'No authentication token found. Please log in again.';
      return;
    }

    // Set the authToken in the request headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);

    // Make the HTTP request to fetch user profile data with the token in the header
    this.http.get<any>('http://77.37.86.136:8002/account/individual/default-method/read', { headers }).subscribe({
      next: (data) => {
        // Assign the fetched data to the userData object
        this.userData = {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.birthdate,
          sex: data.gender,
          email: data.email
        };
      },
      error: (error) => {
        console.error('Error fetching user data:', error);
        this.status = 'error';
        this.statusMessage = 'Failed to fetch profile data. Please try again later.';
      }
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }
  // Property to store the random message
  randomMessage: string | null = null;

  // Function to toggle the visibility of the modal
  onClose(): void {
    this.closeModal.emit();
  }



  onsmth(): void {
    console.log('Close button clicked in modal');
    this.closeModal.emit();

  }
  saveChanges(): void {
    // Validate if any fields are empty
    if (!this.userData.firstName || !this.userData.lastName || !this.userData.dateOfBirth || !this.userData.sex || !this.userData.email) {
      this.status = 'error';
      this.statusMessage = 'All fields are required! Please fill in all the fields.';
      return;
    }
  
    // Fetch the password from localStorage
    const password = localStorage.getItem('password');
    console.log('Password from localStorage:', password);  // Check password
  

  
    // Prepare the body for the API request
    const updateData = {
      idAccount: 2,
      firstName: this.userData.firstName,
      lastName: this.userData.lastName,
      email: this.userData.email,
      gender: this.userData.sex,
      birthdate: this.userData.dateOfBirth,
      password: password
    };
  
    console.log('Update Data:', updateData);  // Log the body to verify it
  
    // Retrieve the authToken from localStorage
    const authToken = localStorage.getItem('authToken');
    if (!authToken) {
      this.status = 'error';
      this.statusMessage = 'Authentication token is missing. Please log in again.';
      return;
    }
  
    console.log('Authorization Token:', authToken);  // Verify token
  
    // Set the authToken in the request headers
    const headers = new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
  
    // Make the HTTP request to update the profile data
    this.http.put<any>('http://77.37.86.136:8002/account/individual/default-method/update', updateData, { headers }).subscribe({
      next: (response) => {
        console.log('Profile updated successfully:', response);
        this.status = 'success';
        this.isEditing = false;
      },
      error: (error) => {
        console.error('Error updating profile:', error);
  
        if (error.error) {
          console.error('Error message from server:', error.error.message);
          this.status = 'error';
          this.statusMessage = `Failed to update profile: ${error.error.message || error.message}`;
        } else {
          this.status = 'error';
          this.statusMessage = 'An unknown error occurred while updating the profile.';
        }
      }
    });
  }
  














 

  fetchStreakAndTrophy(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      console.error('User ID is missing');
      return;
    }

    const body = userId;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post('http://77.37.86.136:8002/reward/read', body, { headers })
      .subscribe(
        (response: any) => {
          this.streak = response.streak;  // Get streak value
          this.trophy = response.trophy;  // Get trophy value
          this.streakData = this.generateStreakData(this.streak);  // Generate streak days
        },
        (error) => {
          console.error('Error fetching streak and trophy:', error);
        }
      );
  }

  generateStreakData(streak: number): any[] {
    const streakDays = [];
    for (let i = 0; i < 7; i++) {
      const isDayActive = i < streak;
      const dayState = localStorage.getItem('state'); // Check if 'state' is 'done' in localStorage
  
      // If it's Day 1 and state is 'done', mark it as active (green)
      const isDayOneActive = (i === 0 && dayState === 'done') ? true : isDayActive;
  
      streakDays.push({
        day: `Day ${i + 1}`,
        active: isDayOneActive // Mark first day green if state is 'done'
      });
    }
    return streakDays;
  }
  
}
