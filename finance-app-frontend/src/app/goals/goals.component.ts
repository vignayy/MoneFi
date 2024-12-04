import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { AddGoalDialogComponent } from '../add-goal-dialog/add-goal-dialog.component';
import { MatDialog } from '@angular/material/dialog';

interface Goal {
  id: number;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  deadLine: Date;
  category: string;
  icon: string;
  color: string
}

interface inputGoal {
  id: number;
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  deadLine: Date;
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

  ngOnInit() {
    this.loadGoals();
  }

  constructor(private httpClient:HttpClient, private dialog: MatDialog){};
  baseUrl = "http://localhost:8765";

  loadGoals() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
    // console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        // console.log(userId);
  
        this.httpClient.get<inputGoal[]>(`${this.baseUrl}/api/user/${userId}/goals`).subscribe({
          next: (data) => {
            // console.log(data);
            this.goals = data.map(goal => this.modelConverterFunction(goal));
            // console.log(this.goals);
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

  addGoal() {
    const dialogRef = this.dialog.open(AddGoalDialogComponent, {
      width: '500px',
      panelClass: 'income-dialog',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = sessionStorage.getItem('finance.auth');
        // console.log(token);
  
        this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
          next: (userId) => {
            // console.log(userId);
            
            // Send POST request with the income data
            const goalData = {
              ...result, // This should contain fields like source, amount, date, category, recurring, etc.
              // userId: userId, // Add userId if your backend requires it
            };
            this.httpClient.post<inputGoal>(`${this.baseUrl}/api/user/${userId}/goal`, goalData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).subscribe({
              next: (newGoal) => {
                // console.log(newGoal);
                // this.goals = newGoal.map(goal => this.modelConverterFunction(goal));
                const newGoalConverted = this.modelConverterFunction(newGoal); // Convert single goal
                this.goals.push(newGoalConverted); // Add to existing goals array
                // console.log(this.goals);
                this.loadGoals();
              },
              error: (error) => {
                console.error('Failed to add goal data:', error);
              },
              complete: () => {
                this.loading = false;
              },
            });
          },
          error: (error) => {
            console.error('Failed to fetch userId:', error);
            this.loading = false;
          },
        });
      }
    });
  }


 
  modelConverterFunction(data: inputGoal): Goal {
    let icon = '';
    let color = '';
    
    if (data.category === 'Travel') {
      icon = 'fa-plane';
      color = '#2196F3';
    } else if (data.category === 'Savings') {
      icon = 'fa-shield-alt';
      color = '#4CAF50';
    } else if (data.category === 'Vehicle') {
      icon = 'fa-car';
      color = '#FF9800';
    } else if (data.category === 'Health') {
      icon = 'fa-heartbeat';
      color = '#E91E63';
    } else if (data.category === 'Education') {
      icon = 'fa-graduation-cap';
      color = '#673AB7';
    } else if (data.category === 'Home') {
      icon = 'fa-home';
      color = '#009688';
    } else if (data.category === 'Investments') { 
      icon = 'fa-chart-line'; // Investment-related icon
      color = '#3F51B5';      // Investment-related color
    } else {
      icon = 'fa-question-circle'; // Default icon
      color = '#9E9E9E';           // Default color
    }
  
    return {
      id: data.id,
      goalName: data.goalName,
      currentAmount: data.currentAmount,
      targetAmount: data.targetAmount,
      deadLine: new Date(data.deadLine),
      category: data.category,
      icon: icon,
      color: color
    };
  }
  
  

  getProgressPercentage(currentAmount: number, targetAmount: number): number {
    return (currentAmount / targetAmount) * 100;
  }

  getDaysRemaining(deadline: Date): number {
    if (!deadline) {
      console.error('Deadline is undefined or null');
      return NaN;
    }
  
    const deadlineDate = deadline;
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

  
  viewGoalDetails(goal: Goal) {
    
  }
  deleteGoal(goalId : number){
    console.log(goalId);
    this.httpClient.delete<void>(`${this.baseUrl}/api/user/${goalId}/goal`)
      .subscribe({
        next: () => {
          console.log(`Expense with ID ${goalId} deleted successfully.`);
          this.loadGoals(); // Reload the data after successful deletion
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
        }
      });
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

}