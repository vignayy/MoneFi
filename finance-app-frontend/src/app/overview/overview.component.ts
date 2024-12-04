import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

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
  financialQuote = "Wealth is not about having a lot of money, it's about having a lot of options. – Chris Rock";
  
  summary: FinancialSummary = {
    income: 0,
    expenses: 0,
    savings: 0,
    netWorth: 0,
    budgetProgress: 0,
    goalsProgress: 0,
    username: 'User'
  };

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadFinancialData();
  }

  private loadFinancialData() {
    // Simulated data - replace with actual service calls
    this.summary = {
      income: 5750,
      expenses: 3200,
      savings: 2550,
      netWorth: 45000,
      budgetProgress: 65,
      goalsProgress: 55,
      username: 'John Doe'
    };
  }

  addTransaction() {
    this.router.navigate(['/transactions/add']);
  }

  createBudget() {
    this.router.navigate(['/budget/create']);
  }

  viewReports() {
    this.router.navigate(['/reports']);
  }
}