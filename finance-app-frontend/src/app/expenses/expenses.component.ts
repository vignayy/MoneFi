import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddExpenseDialogComponent } from '../add-expense-dialog/add-expense-dialog.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';

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
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    AddExpenseDialogComponent,
    NgChartsModule
  ]
})
export class ExpensesComponent {
  totalExpenses: number = 0;
  expenses: Expense[] = [];
  loading: boolean = false;
  recurringPercentage: number = 0;

  public pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF',
        '#FF9F40'
      ]
    }]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right',
      }
    },
    animation: {
      duration: 500
    }
  };

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
              this.updateChartData();
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
                this.updateChartData();
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

  updateExpense(expense: Expense) {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '500px',
      panelClass: 'income-dialog',
      data: { ...expense }, // Pass the income data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = sessionStorage.getItem('finance.auth');

        this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
          next : (userId) => {

            const updatedExpenseData = {
              ...result, // Updated fields from the dialog form
              userId: userId,
            };
            console.log(updatedExpenseData);

            this.httpClient.put<Expense>(`${this.baseUrl}/api/user/${expense.id}/expense`, updatedExpenseData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).subscribe({
              next: (updatedExpense) => {
                console.log('Expense updated successfully:', updatedExpense);
                this.loadExpensesData(); 
              },
              error: (error) => {
                console.error('Failed to update Expense:', error);
              },
            });
          }
        })
  
        
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

  private updateChartData() {
    const categoryMap = new Map<string, number>();
    
    this.expenses.forEach(expense => {
      const currentAmount = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, currentAmount + expense.amount);
    });

    // Update chart data
    this.pieChartData = {
      labels: Array.from(categoryMap.keys()),
      datasets: [{
        data: Array.from(categoryMap.values()),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          '#4BC0C0',
          '#9966FF',
          '#FF9F40'
        ]
      }]
    };

    // Calculate recurring vs one-time ratio
    const recurringTotal = this.expenses
      .filter(expense => expense.recurring)
      .reduce((sum, expense) => sum + expense.amount, 0);
    
    this.recurringPercentage = this.totalExpenses > 0 
      ? Math.round((recurringTotal / this.totalExpenses) * 100)
      : 0;
  }
}
