import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface Expense {
  id: number;
  description: string;
  amount: number;
  date: string;
  category: string;
  recurring: boolean;
}

@Component({
  selector: 'app-expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class ExpensesComponent {
  totalExpenses: number = 0;
  expenses: Expense[] = [];
  loading: boolean = false;

  constructor(private httpClient: HttpClient) {}

  // baseUrl = "http://localhost:8100";

  ngOnInit() {
    this.loadExpensesData();
  }

  loadExpensesData() {
    this.loading = true;
    // Simulated data - replace with actual API call
    this.expenses = [
      { id: 1, description: 'Groceries', amount: 200, date: '2024-03-05', category: 'Food', recurring: true },
      { id: 2, description: 'Electricity Bill', amount: 100, date: '2024-03-10', category: 'Utilities', recurring: true },
      { id: 3, description: 'Gym Membership', amount: 50, date: '2024-03-15', category: 'Health', recurring: true },
    ];
    this.calculateTotalExpenses();
    this.loading = false;
  }

  calculateTotalExpenses() {
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  addExpense() {
    // Implement add expense logic
    console.log('Add expense clicked');
  }
}
