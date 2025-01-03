import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Habit {
  id: number;
  idUser: number;
  name: string;
  checked: boolean;
  daily: boolean;
  weekly: boolean;
  monthly: boolean;
  remainder: string; // This is an ISO date string from the backend
  frequency?: string; // Add this
  reminderTime?: string; // Add this
  goals: Goal[];
}

interface Goal {
  id: number;
  name: string;
  checked: boolean;
}

@Component({
  selector: 'app-habit-management',
  templateUrl: './habit-management.component.html',
  styleUrls: ['./habit-management.component.css']
})
export class HabitManagementComponent implements OnInit {
  userName = '';
  searchQuery = '';
  selectedFeeling = '';
  showAddModal = false;
  showEditModal = false;
  showObjectivesModal = false;
  selectedHabit: Habit | null = null;

  feelings = [
    'Great 😄',
    'Good 🙂',
    'Okay 😐',
    'Tired 😫',
    'Stressed 😰'
  ];

  habits: Habit[] = [];

  newHabit: Habit = {
    id: 0,
    idUser: 0,  // User ID will be dynamically set from localStorage
    name: '',
    checked: false,
    daily: true,
    weekly: false,
    monthly: false,
    remainder: '',
    goals: []
  };

  newObjective = {
    name: '',
    isCompleted: false
  };

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const firstName = localStorage.getItem('firstName');
    if (firstName) {
      this.userName = firstName;
    } else {
      console.warn('First name not found in localStorage.');
    }

    const userId = localStorage.getItem('userId');
    if (userId) {
      // Set the userId for the current session
      this.newHabit.idUser = parseInt(userId, 10); // Ensure userId is parsed to number
    } else {
      console.warn('User ID not found in localStorage.');
    }



      // Retrieve the previously selected feeling from localStorage
  const storedFeeling = localStorage.getItem('selectedFeeling');
  if (storedFeeling) {
    this.selectedFeeling = storedFeeling;
  }
    this.fetchHabits();
  }

  openAddModal() {
    this.showAddModal = true;
    this.newHabit = {
      id: 0,
      idUser: this.newHabit.idUser,  // Use dynamic user ID
      name: '',
      checked: false,
      daily: true,
      weekly: false,
      monthly: false,
      remainder: '',
      goals: []
    };
  }

  closeAddModal() {
    this.showAddModal = false;
  }

  addHabit() {
    if (this.newHabit.name.trim()) {
      let reminderTime: string = this.newHabit.reminderTime ?? '';  // Default to an empty string if undefined
  
      // Log the value of reminderTime to see if it's being set
      console.log("Initial reminderTime:", reminderTime);
  
      // Check if the user entered a time
      if (reminderTime) {
        const date = new Date();
        
        // Split the input time (expected format HH:mm)
        const [hours, minutes] = reminderTime.split(':');
        
        // Log the split values to see if hours and minutes are being parsed correctly
        console.log("Parsed hours:", hours, "Parsed minutes:", minutes);
  
        // Ensure that hours and minutes are valid
        if (hours && minutes) {
          // Set the date with the provided time
          date.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0); // Set the hour and minute
          console.log("Updated date with provided time:", date);
          
          // Manually construct the ISO string to include milliseconds and timezone offset
          reminderTime = date.toISOString(); // Convert to ISO string format
          
          // Ensure the ISO string has milliseconds in the correct format (use a specific format for milliseconds)
          const formattedReminderTime = reminderTime.replace('.000Z', '.000+00:00');
          reminderTime = formattedReminderTime; // Replace with correct milliseconds and timezone offset
          
          // Log the final reminder time for verification
          console.log('Reminder Time Set: ', reminderTime);
          
        } else {
          // If the time format is incorrect, log an error and fallback to the current time
          console.error('Invalid time format');
          reminderTime = new Date().toISOString(); // Fallback to current time
        }
      } else {
        reminderTime = new Date().toISOString(); // Fallback if no time is entered
      }
  
      const habitToAdd = {
        idUser: this.newHabit.idUser,  // Dynamically set user ID
        name: this.newHabit.name,
        checked: this.newHabit.checked,
        daily: this.newHabit.daily,
        weekly: this.newHabit.weekly,
        monthly: this.newHabit.monthly,
        remainder: reminderTime, // Use the user-input time
        goals: this.newHabit.goals.map((goal, index) => ({
          id: index + 1,
          name: goal.name,
          checked: goal.checked
        }))
      };
  
      // Send the request to create the habit
      this.http.post('http://77.37.86.136:8002/habit/create', habitToAdd).subscribe(
        (response: any) => {
          this.habits.push(response);
          this.showAddModal = false;
        },
        (error) => console.error('Error creating habit:', error)
      );
    }
  }
  
  
  
  

  fetchHabits() {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    const body = parseInt(userId, 10);  // Use userId dynamically from localStorage
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    this.http.post<Habit[]>('http://77.37.86.136:8002/habit/read/today', body, { headers })
      .subscribe(
        (response: Habit[]) => {
          this.habits = response;
        },
        (error) => console.error('Error fetching habits:', error)
      );
  }

  toggleHabitCompletion(habit: any) {
    const payload = {
      idHabitOrGoal: habit.id,
      checked: !habit.checked
    };

    this.http.patch('http://77.37.86.136:8002/habit/check', payload).subscribe(
      () => {
        // Update the habit's status locally if the request is successful
        habit.checked = payload.checked;
        localStorage.setItem('state', 'done');

      },
      (error) => {
        console.error('Error updating habit status:', error);
      }
    );
  }

  toggleGoalCompletion(goal: any) {
    const previousCheckedState = goal.checked; // Save the previous state
    goal.checked = !goal.checked; // Optimistically toggle the goal's checked status

    const payload = {
      idHabitOrGoal: goal.id,
      checked: !goal.checked
    };

    // Log the payload to see the body being sent to the backend
    console.log('Payload being sent to the backend:', payload);

    this.http.patch('http://77.37.86.136:8002/habit/goal/check', payload).subscribe(
      () => {
        // If the request is successful, we don't need to do anything as the state is already updated
        localStorage.setItem('state', 'done');

      },
      (error) => {
        console.error('Error updating goal status:', error);
        // If there's an error, we revert the checked status to the previous state
        goal.checked = previousCheckedState;
      }
    );
  }

  editHabit(habit: Habit) {
    this.selectedHabit = { ...habit }; // Create a copy to edit
    this.showEditModal = true;
  }
    // Close the edit modal
    closeEditModal() {
      this.showEditModal = false;
      this.selectedHabit = null;
    }
  
    updateHabit() {
      if (this.selectedHabit) {
        // Vérifier si reminderTime est défini, sinon utiliser une valeur par défaut
        let formattedRemainder: string;
        if (this.selectedHabit.reminderTime) {
          const remainderDate = new Date(this.selectedHabit.reminderTime);
          const isoRemainder = remainderDate.toISOString();  // Convertir en format ISO 8601
          formattedRemainder = isoRemainder.replace('Z', '+00:00');
        } else {
          // Si reminderTime est indéfini, utiliser une valeur par défaut (par exemple, l'heure actuelle)
          const now = new Date();
          formattedRemainder = now.toISOString().replace('Z', '+00:00');
        }
        
        // Préparer l'objet habit mis à jour
        const updatedHabit = {
          id: this.selectedHabit.id,
          idUser: this.selectedHabit.idUser,
          name: this.selectedHabit.name,
          checked: this.selectedHabit.checked,
          daily: this.selectedHabit.frequency === 'daily',
          weekly: this.selectedHabit.frequency === 'weekly',
          monthly: this.selectedHabit.frequency === 'monthly',
          remainder: formattedRemainder, // Utiliser la valeur mise à jour de remainder
          goals: this.selectedHabit.goals.map(goal => ({
            id: goal.id || 0,  // Si 'goal.id' est manquant, utiliser 0
            name: goal.name,
            checked: goal.checked
          }))
        };
    
        // Afficher l'objet dans la console pour vérifier les données envoyées au backend
        console.log('Sending the following data to backend:', updatedHabit);
    
        // Envoyer la requête de mise à jour au backend
        this.http.put('http://77.37.86.136:8002/habit/update', updatedHabit).subscribe(
          (response: any) => {
            // Mettre à jour la liste des habitudes et fermer la fenêtre modale
            const index = this.habits.findIndex(habit => habit.id === response.id);
            if (index !== -1) {
              this.habits[index] = response; // Remplacer l'habitude par la mise à jour
            }
            this.showEditModal = false;
          },
          (error) => {
            console.error('Error updating habit:', error);
          }
        );
      }
    }
    
    

  deleteHabit(habitId: number) {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    // Send the id directly in the body
    this.http.delete('http://77.37.86.136:8002/habit/delete', {
      headers,
      body: habitId, // Include the ID directly in the request body
    }).subscribe(
      () => {
        // Update the local list after successful deletion
        this.habits = this.habits.filter(habit => habit.id !== habitId);
      },
      (error) => console.error('Error deleting habit:', error)
    );
  }

  viewObjectives(habit: Habit) {
    this.selectedHabit = habit;
    this.showObjectivesModal = true; // Example logic
  }

  addObjective() {
    if (this.newObjective.name.trim()) {
      this.newHabit.goals.push({ id: 0, name: this.newObjective.name, checked: false });
      this.newObjective.name = '';
    }
  }

  removeObjective(objective: Goal) {
    this.newHabit.goals = this.newHabit.goals.filter(goal => goal !== objective);
  }
  saveFeeling() {
    if (this.selectedFeeling) {
      localStorage.setItem('selectedFeeling', this.selectedFeeling);
    }
  }
  
}
