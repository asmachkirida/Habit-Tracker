import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';  // Add FormsModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SigninComponent } from './pages/signin/signin.component';
import { SignupComponent } from './pages/signup/signup.component';
import { HabitMainComponent } from './pages/habit/habit-main/habit-main.component';
import { HabitManagementComponent } from './habit-management/habit-management.component';
import { ProgressComponent } from './progress/progress.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { HttpClientModule } from '@angular/common/http';
import { ProfileModalComponent } from './pages/profile-modal/profile-modal.component';
import { NotificationComponent } from './pages/notification/notification.component'; // Import this


@NgModule({
  declarations: [
    AppComponent,
    SigninComponent,
    SignupComponent,
    HabitMainComponent,
    HabitManagementComponent,
    ProgressComponent,
    ProfileModalComponent,
    NotificationComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,           // Add this
    ReactiveFormsModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')  // Proper configuration for echarts
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }