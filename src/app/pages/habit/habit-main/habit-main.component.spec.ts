import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HabitMainComponent } from './habit-main.component';

describe('HabitMainComponent', () => {
  let component: HabitMainComponent;
  let fixture: ComponentFixture<HabitMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HabitMainComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HabitMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
