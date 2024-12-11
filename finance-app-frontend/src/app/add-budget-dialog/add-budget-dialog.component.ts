import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-budget-dialog',
  standalone: true,
  templateUrl: './add-budget-dialog.component.html',
  styleUrl: './add-budget-dialog.component.scss',
    imports: [FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  CommonModule],
})
export class AddBudgetDialogComponent {
  baseUrl = "http://localhost:8765";

  budgetSource = {
    moneyLimit: 0,
    categories: [] as { category: string; percentage: number; moneyLimit: number }[],
  };

  totalIncome: number = 0;

  categories = [
    'Food',
    'Travelling',
    'Entertainment',
    'Groceries',
    'Shopping',
    'Bills & utilities',
    'House Rent',
    'Emi and loans',
    'Health & Medical',
    'Miscellaneous',
  ];

  constructor(
    public dialogRef: MatDialogRef<AddBudgetDialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any ,
    private httpClient: HttpClient
  ) {}


  
  ngOnInit() {
    const token = sessionStorage.getItem('finance.auth');
    
    // Get current month and year
    const currentDate = new Date();
    const month = currentDate.getMonth() + 1; 
    const year = currentDate.getFullYear();
    console.log(month);
    console.log(year);
  
    if (token) {
      this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
        next: (userId) => {
          this.httpClient.get<number>(`${this.baseUrl}/api/user/${userId}/totalIncome/${month}/${year}`).subscribe({
            next: (totalIncome) => {
              this.totalIncome = totalIncome;
              this.initializeCategories();
            },
          });
        },
      });
    }
  }
  

  initializeCategories() {
    // Generate random percentages that sum up to 100
    const randomPercentages = this.generateRandomPercentages(this.categories.length);

    // Assign percentages and calculate initial amounts
    this.budgetSource.categories = this.categories.map((category, index) => ({
      category,
      percentage: randomPercentages[index],
      moneyLimit: 0,
    }));
  }

  generateRandomPercentages(count: number): number[] {
    const percentages = Array.from({ length: count }, () => Math.random());
    const sum = percentages.reduce((acc, value) => acc + value, 0);

    // Normalize to make the sum 100
    return percentages.map((value) => Math.round((value / sum) * 100));
  }

  onBudgetChange() {
    const totalBudget = this.budgetSource.moneyLimit;
    this.budgetSource.categories.forEach((category) => {
      category.moneyLimit = (totalBudget * category.percentage) / 100;
    });
  }

  onSave() {
    const totalPercentage = this.budgetSource.categories.reduce(
      (sum, category) => sum + category.percentage,
      0
    );

    // if (totalPercentage !== 100) {
    //   alert('An internal error occurred: Percentages do not sum to 100.');
    //   return;
    // }
    this.dialogRef.close(this.budgetSource);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
