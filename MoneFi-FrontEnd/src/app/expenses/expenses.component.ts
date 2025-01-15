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
import { MatSelectModule } from '@angular/material/select';
import { CountUpDirective } from '../shared/directives/count-up.directive';

interface Expense {
  id: number;
  amount: number;
  date: string;
  category: string;
  description: string;  
  recurring: boolean;
}

interface FinancialSummary {
  income: number;
  expenses: number;
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
    NgChartsModule,
    MatSelectModule,
    CountUpDirective
  ]
})
export class ExpensesComponent {
  totalExpenses: number = 0;
  expenses: Expense[] = [];
  loading: boolean = false;
  recurringPercentage: number = 0;
  selectedYear: number = new Date().getFullYear();
  selectedMonth: number = 0; // 0 means all months
  selectedCategory: string = '';
  months: string[] = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  availableYears: number[] = [];
  uniqueCategories: string[] = [];
  totalIncome: number = 0;
  spentPercentage: number = 0;
  incomeLeft: number = 0;

  public pieChartData: ChartData<'pie' | 'doughnut', number[], string> = {
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
  };

  constructor(private httpClient: HttpClient, private dialog: MatDialog, private router:Router, private toastr:ToastrService) {}

  baseUrl = "http://localhost:8765";

  // ngOnInit() {
  //   this.initializeFilters();
  //   this.loadExpensesData();
  // }
  ngOnInit() {
    this.initializeFilters();
    
    // Set the default month to the current month (1-based index)
    this.selectedMonth = new Date().getMonth() + 1; // Current month in 1-based index
    this.selectedYear = new Date().getFullYear(); // Current year
  
    this.loadExpensesData();
  }
  

  initializeFilters() {
    // Generate last 5 years
    const currentYear = new Date().getFullYear();
    this.availableYears = Array.from({length: 5}, (_, i) => currentYear - i);
  }

  loadExpensesData() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        let url: string;
        if (this.selectedMonth === 0) {
          // Fetch all expenses for the selected year
          url = `${this.baseUrl}/api/user/expenses/${userId}/${this.selectedYear}`;
        } else {
          // Fetch expenses for the specific month and year
          url = `${this.baseUrl}/api/user/expenses/${userId}/${this.selectedMonth}/${this.selectedYear}`;
        }
  
        this.httpClient.get<Expense[]>(url).subscribe({
          next: (data) => {
            if (data && data.length > 0) {
              this.expenses = data;
              this.applyFilters(); // Apply all filters after fetching data
              this.calculateTotalExpenses();
              this.updateChartData();
              this.updateUniqueCategories();
            } else {
              this.expenses = [];
              this.toastr.warning('No expenses found for the selected filters.', 'No Data');
            }
          },
          error: (error) => {
            console.error('Failed to load Expense data:', error);
            this.toastr.error('Failed to load expenses', 'Error');
          },
          complete: () => {
            this.loading = false;
          }
        });

        this.httpClient.get<number>(`${this.baseUrl}/api/user/${userId}/totalIncome/${this.selectedMonth}/${this.selectedYear}`).subscribe({
          next: (totalIncome) => {
            this.totalIncome = totalIncome;
            this.calculateSpentPercentage();
          },
          error: (error) => {
            console.log('Failed to get income details', error);
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


  applyFilters() {
    // Filter by category if a category is selected
    if (this.selectedCategory) {
      this.expenses = this.expenses.filter(expense => expense.category === this.selectedCategory);
    }
  }
  

  calculateTotalExpenses() {
    this.totalExpenses = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    this.calculateSpentPercentage();
  }

  addExpense() {
    const dialogRef = this.dialog.open(AddExpenseDialogComponent, {
      width: '500px',
      panelClass: 'income-dialog',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Check if adding this expense would exceed income
        if (this.totalExpenses + result.amount > this.totalIncome) {
          this.toastr.error('Cannot add expense. Amount exceeds Available Income.', 'Insufficient Income');
          return;
        }

        const token = sessionStorage.getItem('finance.auth');
        
        this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
          next: (userId) => {
            // Send POST request with the expense data
            const formattedDate = this.formatDate(result.date);
            const expenseData = {
              ...result,
              date: formattedDate,
              userId: userId,
            };

            this.httpClient.post<Expense>(`${this.baseUrl}/api/user/${userId}/expense`, expenseData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).subscribe({
              next: (newExpense) => {
                this.expenses.push(newExpense);
                this.calculateTotalExpenses();
                this.updateChartData();
                this.toastr.success('Expense added successfully');
              },
              error: (error) => {
                console.error('Failed to add expense data:', error);
                this.toastr.error('Failed to add expense', 'Error');
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
      data: { ...expense, isUpdate: true },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Calculate what the total expenses would be after this update
        const updatedTotalExpenses = this.totalExpenses - expense.amount + result.amount;
        
        // Check if the update would exceed income
        if (updatedTotalExpenses > this.totalIncome) {
          this.toastr.error('Cannot update expense. Amount exceeds available income.', 'Insufficient Income');
          return;
        }

        const token = sessionStorage.getItem('finance.auth');

        this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
          next: (userId) => {
            const formattedDate = this.formatDate(result.date);
            const updatedExpenseData = {
              ...result,
              date: formattedDate,
              userId: userId,
            };

            this.httpClient.put<Expense>(
              `${this.baseUrl}/api/user/${expense.id}/expense`,
              updatedExpenseData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).subscribe({
              next: (updatedExpense) => {
                console.log('Expense updated successfully:', updatedExpense);
                this.loadExpensesData();
                this.toastr.success('Expense updated successfully');
              },
              error: (error) => {
                console.error('Failed to update Expense:', error);
                this.toastr.error('Failed to update expense', 'Error');
              },
            });
          }
        });
      }
    });
  }
  
  formatDate(date: string): string {
    const d = new Date(date);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const dd = String(d.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  deleteExpense(expenseId: number): void {
    const index = this.expenses.findIndex(i=>i.id === expenseId);
    if (index !== -1) {
      this.expenses.splice(index, 1); // Remove the item at the found index
    }
    this.calculateTotalExpenses();
    this.httpClient.delete<void>(`${this.baseUrl}/api/user/${expenseId}/expense`)
      .subscribe({
        next: () => {
          console.log(`Expense with ID ${expenseId} deleted successfully.`);
          // this.loadExpensesData(); // Reload the data after successful deletion
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

  updateUniqueCategories() {
    // Ensure "All Categories" is an option
    this.uniqueCategories = ['', ...new Set(this.expenses.map(expense => expense.category))];
  }

  filterExpenses() {
    this.loadExpensesData();
  }

  resetFilters() {
    const today = new Date();
    this.selectedYear = today.getFullYear(); // Reset to the current year
    this.selectedMonth = today.getMonth() + 1; // Reset to the current month (1-based index)
    this.selectedCategory = ''; // Reset to all categories
    this.filterExpenses();
  }

  getProgressColor(spent: number, total: number): string {
    const percentage = (spent / total) * 100;
    if (percentage >= 90) return '#E54A00';  //  Red E53935
    if (percentage >= 50) return '#FB8C00';  //  Orange 
    return '#FFB300';  // Yellow FFB300
  }

  private calculateSpentPercentage() {
    this.spentPercentage = this.totalIncome > 0 
      ? parseFloat(((this.totalExpenses / this.totalIncome) * 100).toFixed(2))
      : 0;
    this.incomeLeft = this.totalIncome - this.totalExpenses;
  }
  
  getSpendingStatusMessage(percentage: number): string {
    if (percentage >= 90) {
      return 'Warning: Spending exceeds 90% of income. Consider reducing expenses.';
    } else if (percentage >= 75) {
      return 'Caution: Approaching income limit. Review your spending.';
    } else if (percentage >= 50) {
      return 'Moderate spending. You\'re maintaining good balance.';
    } else {
      return 'Great job! Your spending is well under control.';
    }
  }
}
