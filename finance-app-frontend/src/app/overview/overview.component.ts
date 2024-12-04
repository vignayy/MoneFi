import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

interface FinancialSummary {
  income: number;
  expenses: number;
  savings: number;
  budgetProgress: number;
  goalsProgress: number;
  username: string;
}

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressBarModule, MatIconModule],
  templateUrl: './overview.component.html',
  styleUrl: './overview.component.css'
})
export class OverviewComponent implements OnInit {
  financialQuote = "You can make money two ways — make more, or spend less. – John Hope Bryant";
  summary: FinancialSummary = {
    income: 0,
    expenses: 0,
    savings: 0,
    budgetProgress: 0,
    goalsProgress: 0,
    username: 'User' // This will be replaced with actual username
  };

  ngOnInit() {
    // TODO: Implement service calls to fetch data
    this.loadFinancialData();
  }

  private loadFinancialData() {
    // Temporary mock data - replace with actual service calls
    this.summary = {
      income: 5000,
      expenses: 3000,
      savings: 2000,
      budgetProgress: 60,
      goalsProgress: 45,
      username: 'John'
    };
  }
}
