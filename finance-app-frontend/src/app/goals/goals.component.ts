import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Goal {
  id: number;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  deadLine: string;
  category: string;
  icon: string;
  color: string
}

interface inputGoal {
  id: number;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  deadLine: string;
  category: string;
}

@Component({
  selector: 'app-goals',
  templateUrl: './goals.component.html',
  styleUrls: ['./goals.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class GoalsComponent {
  goals: Goal[] = [];
  loading: boolean = false;
  selectedGoal: Goal | null = null;

  ngOnInit() {
    this.loadGoals();
  }

  constructor(private httpClient:HttpClient){};
  baseUrl = "http://localhost:8765";

  // loadGoals() {
  //   this.loading = true;
  //   // Simulated data - replace with actual API call
  //   this.goals = [
  //     {
  //       id: 1,
  //       goalName: 'Dream Vacation',
  //       currentAmount: 3000,
  //       targetAmount: 5000,
  //       deadline: '2024-12-31',
  //       category: 'Travel',
  //       icon: 'fa-plane',
  //       color: '#2196F3'
  //     },
  //     {
  //       id: 2,
  //       goalName: 'Emergency Fund',
  //       currentAmount: 8000,
  //       targetAmount: 10000,
  //       deadline: '2026-09-30',
  //       category: 'Savings',
  //       icon: 'fa-shield-alt',
  //       color: '#4CAF50'
  //     },
  //     {
  //       id: 3,
  //       goalName: 'New Car',
  //       currentAmount: 15000,
  //       targetAmount: 30000,
  //       deadline: '2025-06-30',
  //       category: 'Vehicle',
  //       icon: 'fa-car',
  //       color: '#FF9800'
  //     }
  //   ];
  //   this.loading = false;
  // }

  loadGoals() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
    console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        console.log(userId);
  
        this.httpClient.get<inputGoal[]>(`${this.baseUrl}/api/user/${userId}/goals`).subscribe({
          next: (data) => {
            this.goals = data.map(goal => this.modelConverterFunction(goal));
            this.loading = false;
          },
          error: (error) => {
            console.error('Failed to load Goal data:', error);
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Failed to fetch userId:', error);
        this.loading = false;
      }
    });
  }

  modelConverterFunction(data: inputGoal): Goal {
    let icon = '';
    let color = '';
  console.log(data);
    if (data.category === 'Travel') {
      icon = 'fa-plane';
      color = '#2196F3';
    } else {
      if (data.category === 'Savings') {
        icon = 'fa-shield-alt';
        color = '#4CAF50';
      } else {
        if (data.category === 'Vehicle') {
          icon = 'fa-car';
          color = '#FF9800';
        } else {
          if (data.category === 'Health') {
            icon = 'fa-heartbeat';
            color = '#E91E63';
          } else {
            if (data.category === 'Education') {
              icon = 'fa-graduation-cap';
              color = '#673AB7';
            } else {
              if (data.category === 'Home') {
                icon = 'fa-home';
                color = '#009688';
              } else {
                icon = 'fa-question-circle'; // Default icon
                color = '#9E9E9E'; // Default color
              }
            }
          }
        }
      }
    }
  console.log(color); console.log(icon);
    return {
      id: data.id,
      goalName: data.goalName,
      currentAmount: data.currentAmount,
      targetAmount: data.targetAmount,
      deadLine: data.deadLine,
      category: data.category,
      icon: icon,
      color: color
    };
  }
  

  getProgressPercentage(currentAmount: number, targetAmount: number): number {
    return (currentAmount / targetAmount) * 100;
  }

  // getDaysRemaining(deadline: string): number {
  //   const today = new Date();
  //   const deadlineDate = new Date(deadline);
  //   const diffTime = deadlineDate.getTime() - today.getTime();
  //   console.log(diffTime);
  //   return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  // }
  getDaysRemaining(deadline: string): number {
    if (!deadline) {
      console.error('Deadline is undefined or null');
      return NaN;
    }
  
    const deadlineDate = new Date(deadline);
    if (isNaN(deadlineDate.getTime())) {
      console.error('Invalid deadline date:', deadline);
      return NaN;
    }
  
    const today = new Date();
    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  

  getProgressColor(currentAmount: number, targetAmount: number): string {
    const percentage = this.getProgressPercentage(currentAmount, targetAmount);
    if (percentage >= 90) return '#4caf50';
    if (percentage >= 50) return '#2196f3';
    return '#ff9800';
  }

  addGoal() {
    // Implement add goal logic
    console.log('Add goal clicked');
  }

  viewGoalDetails(goal: Goal) {
    this.selectedGoal = goal;
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  // calculateMonthlyTarget(goal: Goal): number {
  //   const today = new Date();
  //   const deadline = new Date(goal.deadline);
  //   const monthsRemaining = (deadline.getFullYear() - today.getFullYear()) * 12 + 
  //                         (deadline.getMonth() - today.getMonth());
  //   const remainingAmount = goal.targetAmount - goal.currentAmount;
  //   return remainingAmount / monthsRemaining;
  // }
}