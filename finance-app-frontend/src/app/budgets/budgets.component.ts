import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Budget {
  id: number;
  category: string;
  moneyLimit: number;
  currentSpending: number;
}

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BudgetsComponent {

  constructor(private httpClient:HttpClient){};
  baseUrl = "http://localhost:8765";

  totalBudget: number = 0;
  totalSpent: number = 0;
  budgets: Budget[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.loadBudgetData();
  }

  // loadBudgetData() {
  //   this.loading = true;
    
    
  //   this.calculateTotals();
  //   this.loading = false;
  // }
  loadBudgetData() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
    console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        console.log(userId);
  
        this.httpClient.get<Budget[]>(`${this.baseUrl}/api/user/${userId}/budgets`).subscribe({
          next: (data) => {
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
        this.loading = false;
      }
    });
  }

  calculateTotals() {
    this.totalBudget = this.budgets.reduce((sum, budget) => sum + budget.moneyLimit, 0);
    this.totalSpent = this.budgets.reduce((sum, budget) => sum + budget.currentSpending, 0);
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

  addBudget() {
    // Implement add budget logic
    console.log('Add budget clicked');
  }
}