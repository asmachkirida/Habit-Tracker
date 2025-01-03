import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitManagementComponent } from './habit-management.component';

describe('HabitManagementComponent', () => {
  let component: HabitManagementComponent;
  let fixture: ComponentFixture<HabitManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitManagementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
