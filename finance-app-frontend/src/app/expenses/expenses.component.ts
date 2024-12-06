import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Expense {
  id: number;
  amount: number;
  date: string;
  category: string;
  description: string;  
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

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router:Router, private toastr:ToastrService) {}

  baseUrl = "http://localhost:8765";

  ngOnInit() {
    this.loadExpensesData();
  }

  loadExpensesData() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
    // console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        // console.log(userId);
  
        this.httpClient.get<Expense[]>(`${this.baseUrl}/api/user/${userId}/expenses`).subscribe({
          next: (data) => {
            // this.expenses = data;
            // this.calculateTotalExpenses();
            if (data && data.length > 0) {
              this.expenses = data; 
              this.calculateTotalExpenses();
            } else {
              this.expenses = [];
              this.toastr.warning('No Expense data available for this user.', 'No Data');
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Failed to load Expense data:', error);
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

  calculateTotalExpenses() {
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  }

  addExpense() {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
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
            const expenseData = {
              ...result, // This should contain fields like source, amount, date, category, recurring, etc.
              userId: userId, // Add userId if your backend requires it
            };
            console.log(expenseData);
            this.httpClient.post<Expense>(`${this.baseUrl}/api/user/${userId}/expense`, expenseData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).subscribe({
              next: (newExpense) => {
                this.expenses.push(newExpense);
                this.calculateTotalExpenses();
              },
              error: (error) => {
                console.error('Failed to add expense data:', error);
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


  deleteExpense(expenseId: number): void {
    console.log(expenseId);
    this.httpClient.delete<void>(`${this.baseUrl}/api/user/${expenseId}/expense`)
      .subscribe({
        next: () => {
          console.log(`Expense with ID ${expenseId} deleted successfully.`);
          this.loadExpensesData(); // Reload the data after successful deletion
        },
        error: (err) => {
          console.error('Error deleting expense:', err);
        }
      });
  }
}
