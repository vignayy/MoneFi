import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Budget {
  id: number;
  category: string;
  allocated: number;
  spent: number;
  remaining: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-budgets',
  templateUrl: './budgets.component.html',
  styleUrls: ['./budgets.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class BudgetsComponent {
  totalBudget: number = 0;
  totalSpent: number = 0;
  budgets: Budget[] = [];
  loading: boolean = false;

  ngOnInit() {
    this.loadBudgetData();
  }

  loadBudgetData() {
    this.loading = true;
    // Simulated data - replace with actual API call
    this.budgets = [
      { 
        id: 1, 
        category: 'Housing', 
        allocated: 1500, 
        spent: 1200, 
        remaining: 300, 
        icon: 'fa-home',
        color: '#2196F3'
      },
      { 
        id: 2, 
        category: 'Food & Dining', 
        allocated: 600, 
        spent: 450, 
        remaining: 150, 
        icon: 'fa-utensils',
        color: '#4CAF50'
      },
      { 
        id: 3, 
        category: 'Transportation', 
        allocated: 400, 
        spent: 380, 
        remaining: 20, 
        icon: 'fa-car',
        color: '#FF9800'
      },
      { 
        id: 4, 
        category: 'Entertainment', 
        allocated: 300, 
        spent: 250, 
        remaining: 50, 
        icon: 'fa-film',
        color: '#9C27B0'
      }
    ];
    
    this.calculateTotals();
    this.loading = false;
  }

  calculateTotals() {
    this.totalBudget = this.budgets.reduce((sum, budget) => sum + budget.allocated, 0);
    this.totalSpent = this.budgets.reduce((sum, budget) => sum + budget.spent, 0);
  }

  getProgressPercentage(spent: number, allocated: number): number {
    return (spent / allocated) * 100;
  }

  getProgressColor(spent: number, allocated: number): string {
    const percentage = this.getProgressPercentage(spent, allocated);
    if (percentage >= 90) return '#f44336';  // Red
    if (percentage >= 75) return '#ff9800';  // Orange
    return '#4caf50';  // Green
  }

  addBudget() {
    // Implement add budget logic
    console.log('Add budget clicked');
  }
}