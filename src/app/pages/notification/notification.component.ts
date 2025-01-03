import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  message: string = '';
  notificationVisible: boolean = false;
  notifications: string[] = []; // Store multiple notifications
  habitData: any[] = []; // Store the fetched habit data

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchHabits();
  }

  fetchHabits() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const body = parseInt(userId, 10);  // Use userId dynamically from localStorage
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<any[]>('http://77.37.86.136:8002/habit/read/today', body, { headers })
      .subscribe(
        (response) => {
          this.habitData = response;  // Store the habit data
          console.log('Fetched habits:', response);  // Log the habits to the console
          this.scheduleNotifications();  // Start scheduling notifications
        },
        (error) => console.error('Error fetching habits:', error)
      );
  }

  // Schedule notifications based on the reminder time
  scheduleNotifications() {
    const now = new Date();
    console.log('Current Time:', now);
  
    this.habitData.forEach((habit) => {
      const reminderTime = new Date(habit.remainder);
  
      if (reminderTime.getDate() === now.getDate() && reminderTime > now) {
        const timeToWait = reminderTime.getTime() - now.getTime();
        console.log(`Time to wait for notification: ${timeToWait / 1000} seconds`);
  
        setTimeout(() => {
          this.showNotification();  // Show a random notification message
        }, timeToWait);
      }
    });
  }
  
  

  // Show the notification with a custom message
// Show the notification with a random message
showNotification() {
  const randomMessages = [
    '🎉 Time to achieve something amazing today! 💪',
    '🚀 Keep up the great work! You got this! ✨',
    '🎯 Stay focused, your goals are within reach! 💡',
    '🔥 You are on fire today! Keep going! 🚀',
    '🌟 Keep pushing, youre closer to success! 🎉'
  ];

  // Randomly select a message from the array
  const randomMessage = randomMessages[Math.floor(Math.random() * randomMessages.length)];
  
  this.message = randomMessage;  // Set the random message
  console.log('Notification message:', this.message);  // Log the message for debugging
  
  this.notificationVisible = true;  // Show the notification

  // Auto hide after 5 seconds
  setTimeout(() => {
    this.hideNotification();
  }, 10000);
}


  // Hide the notification
  hideNotification() {
    this.notificationVisible = false;
  }
}
