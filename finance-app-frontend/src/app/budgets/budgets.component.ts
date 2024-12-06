import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddIncomeDialogComponent } from '../add-income-dialog/add-income-dialog.component';
import { AddBudgetDialogComponent } from '../add-budget-dialog/add-budget-dialog.component';
import { AddGoalDialogComponent } from '../add-goal-dialog/add-goal-dialog.component';

interface Budget {
  id: number;
  category: string;
  moneyLimit: number;
  currentSpending: number;
  remaining:number;
}

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BudgetsComponent {

  constructor(private httpClient:HttpClient, private router:Router, private dialog: MatDialog){};
  baseUrl = "http://localhost:8765";

  totalBudget: number = 0;
  totalSpent: number = 0;
  budgets: Budget[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.loadBudgetData();
  }

  loadBudgetData() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
    console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        console.log(userId);
  
        this.httpClient.get<Budget[]>(`${this.baseUrl}/api/user/${userId}/budgets`).subscribe({
          next: (data) => {
            this.calculateBudgetRemaining(data);
            this.budgets = data;
            this.calculateTotals();
          },
          error: (error) => {
            console.error('Failed to load Budget data:', error);
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Failed to fetch userId:', error);
        alert("Session timed out! Please login again");
        sessionStorage.removeItem('finance.auth');
        this.router.navigate(['login']);
        this.loading = false;
      }
    });
  }

  calculateTotals() {
    this.totalBudget = this.budgets.reduce((sum, budget) => sum + budget.moneyLimit, 0);
    this.totalSpent = this.budgets.reduce((sum, budget) => sum + budget.currentSpending, 0);
  }
  calculateBudgetRemaining(data: Budget[]): void {
    data.forEach(budget => {
      budget.remaining = budget.moneyLimit - budget.currentSpending;
    });
  }
  

  getProgressPercentage(currentSpending: number, moneyLimit: number): number {
    return (currentSpending / moneyLimit) * 100;
  }

  getProgressColor(currentSpending: number, moneyLimit: number): string {
    const percentage = this.getProgressPercentage(currentSpending, moneyLimit);
    if (percentage >= 90) return '#f44336';  // Red
    if (percentage >= 75) return '#ff9800';  // Orange
    return '#4caf50';  // Green
  }

  // addBudget() {
  //   // Implement add budget logic
  //   console.log('Add budget clicked');
  // }
  addBudget() {
    const dialogRef = this.dialog.open(AddBudgetDialogComponent, {
      width: '500px',
      panelClass: 'income-dialog',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = sessionStorage.getItem('finance.auth');
        console.log(token);
  
        this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
          next: (userId) => {
            console.log(userId);
            
            // Send POST request with the income data
            const budgetData = {
              ...result, // This should contain fields like source, amount, date, category, recurring, etc.
              userId: userId, // Add userId if your backend requires it
            };
            console.log(budgetData);
            this.httpClient.post<Budget>(`${this.baseUrl}/api/user/${userId}/budget`, budgetData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).subscribe({
              next: (newBudget) => {
                newBudget.remaining = newBudget.moneyLimit - newBudget.currentSpending;
                this.budgets.push(newBudget);
                this.calculateTotals();
                // this.calculateTotalExpenses();
              },
              error: (error) => {
                console.error('Failed to add budget data:', error);
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
}