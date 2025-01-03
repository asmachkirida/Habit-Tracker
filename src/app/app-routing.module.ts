import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HabitMainComponent } from './pages/habit/habit-main/habit-main.component'; // Import the habit component

const routes: Routes = [
  { path: 'signin', component: SigninComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'habit', component: HabitMainComponent }, // Route for the habit layout
  { path: '', redirectTo: '/signin', pathMatch: 'full' }, // Default route
  { path: '**', redirectTo: '/signin' }, // Wildcard route for unknown paths
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
