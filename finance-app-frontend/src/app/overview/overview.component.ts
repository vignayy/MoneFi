import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

interface FinancialSummary {
  income: number;
  expenses: number;
  savings: number;
  netWorth: number;
  budgetProgress: number;
  goalsProgress: number;
  username: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CommonModule, 
    MatCardModule, 
    MatProgressBarModule, 
    MatIconModule,
    MatButtonModule
  ],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  // financialQuote = "Wealth is not about having a lot of money, it's about having a lot of options. – Chris Rock";
  
  summary: FinancialSummary = {
    income: 0,
    expenses: 0,
    savings: 0,
    netWorth: 0,
    budgetProgress: 0,
    goalsProgress: 0,
    username: ''
  };

  constructor(private router: Router, private httpClient:HttpClient) {}
  baseUrl = "http://localhost:8765";

  ngOnInit() {
    this.loadFinancialData();
  }

  private loadFinancialData() {
    const token = sessionStorage.getItem('finance.auth');
    // console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next : (userId) => {
        // console.log(userId);

        this.httpClient.get(`${this.baseUrl}/api/user/getName/${userId}`, {responseType : 'text'}).subscribe({
          next : (userName) => {
            this.summary.username = userName;
          },
          error : (error) => {
            console.log('Failed to get the user name', error);
          }
        })

        this.httpClient.get<number>(`${this.baseUrl}/api/user/${userId}/totalIncome`).subscribe({
          next : (totalIncome) => {
            this.summary.income = totalIncome;

            this.httpClient.get<number>(`${this.baseUrl}/api/user/${userId}/totalExpense`).subscribe({
              next : (totalExpense) => {
                this.summary.expenses = totalExpense;
                this.summary.netWorth = totalIncome - totalExpense;
              },
              error : (error) => {
                console.log('Failed to get the expense details', error);
              }
            })
          },
          error : (error) => {
            console.log('Failed to get the income details', error);
          }
        })


        this.httpClient.get<number>(`${this.baseUrl}/api/user/${userId}/totalCurrentGoalIncome`).subscribe({
          next : (totalCurrentGoalIncome) => {
            this.summary.savings = totalCurrentGoalIncome;
            
            this.httpClient.get<number>(`${this.baseUrl}/api/user/${userId}/totalTargetGoalIncome`).subscribe({
              next: (totalTargetGoalIncome) => {
                this.summary.goalsProgress = parseFloat(((totalCurrentGoalIncome/totalTargetGoalIncome)*100).toFixed(2))
              }
            })
          },
          error : (error) => {
            console.log('Failed to get the total goal income details', error);
          }
        })

        this.httpClient.get<number>(`${this.baseUrl}/api/user/${userId}/budgetProgres`).subscribe({
          next : (totalBudgetIncome) => {
            this.summary.budgetProgress = parseFloat((totalBudgetIncome * 100).toFixed(2));;
          },
          error : (error) => {
            console.log('Failed to get the budget progress details', error);
          }
        })
        
      },
      error : (error) => {
        console.log('Failed to get the user Id', error);
        alert("Session timed out! Please login again");
        sessionStorage.removeItem('finance.auth');
        this.router.navigate(['login']);
      }
    })

  }
  
  

  // addTransaction() {
  //   this.router.navigate(['/transactions/add']);
  // }

  // createBudget() {
  //   this.router.navigate(['/budget/create']);
  // }

  // viewReports() {
  //   this.router.navigate(['/reports']);
  // }


  addIncome() {
    this.router.navigate(['/dashboard'], { queryParams: { section: 'income' } });
  }

  createBudget() {
    this.router.navigate(['/dashboard'], { queryParams: { section: 'budgets' } });
  }

  viewReports() {
    this.router.navigate(['/dashboard'], { queryParams: { section: 'analysis' } });
  }

}