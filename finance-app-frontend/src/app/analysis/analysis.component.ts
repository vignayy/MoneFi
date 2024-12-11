import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent {
  baseUrl = "http://localhost:8765";

  constructor(private httpClient: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    const token = sessionStorage.getItem('finance.auth');
    
    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        // Create parallel requests for both expenses and budgets
        const expensesUrl = `${this.baseUrl}/api/user/expenses/${userId}/${currentMonth}/${currentYear}`;
        const budgetsUrl = `${this.baseUrl}/api/user/${userId}/budgets`;

        // Use forkJoin to make parallel requests
        forkJoin({
          expenses: this.httpClient.get<any[]>(expensesUrl),
          budgets: this.httpClient.get<any[]>(budgetsUrl)
        }).subscribe({
          next: ({ expenses, budgets }) => {
            // Process category-wise expenses
            const categoryExpenses = new Map<string, number>();
            expenses.forEach(expense => {
              const currentAmount = categoryExpenses.get(expense.category) || 0;
              categoryExpenses.set(expense.category, currentAmount + expense.amount);
            });

            // Process category-wise budgets
            const categoryBudgets = new Map<string, number>();
            budgets.forEach(budget => {
              categoryBudgets.set(budget.category, budget.moneyLimit);
            });

            // Get unique categories from both expenses and budgets
            const allCategories = Array.from(new Set([
              ...categoryExpenses.keys(),
              ...categoryBudgets.keys()
            ]));

            // Update radar chart data with both datasets
            this.radarChartData = {
              labels: allCategories,
              datasets: [
                {
                  label: 'Monthly Budget',
                  data: allCategories.map(category => categoryBudgets.get(category) || 0),
                  fill: true,
                  backgroundColor: 'rgba(255, 99, 132, 0.2)',
                  borderColor: 'rgb(255, 99, 132)',
                  pointBackgroundColor: 'rgb(255, 99, 132)',
                  pointBorderColor: '#fff',
                },
                {
                  label: 'Current Spending',
                  data: allCategories.map(category => categoryExpenses.get(category) || 0),
                  fill: true,
                  backgroundColor: 'rgba(54, 162, 235, 0.2)',
                  borderColor: 'rgb(54, 162, 235)',
                  pointBackgroundColor: 'rgb(54, 162, 235)',
                  pointBorderColor: '#fff',
                }
              ]
            };

            // Update chart options for better scale
            const maxValue = Math.max(
              ...Array.from(categoryBudgets.values()),
              ...Array.from(categoryExpenses.values())
            );

            this.radarChartOptions = {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: 'top',
                  labels: {
                    padding: 20,
                    font: { size: 12 }
                  }
                },
                title: {
                  display: true,
                  text: 'Monthly Budget vs. Actual Spending',
                  padding: 20,
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                }
              },
              scales: {
                r: {
                  min: 0,
                  max: Math.ceil(maxValue / 1000) * 1000, // Round to nearest thousand
                  ticks: {
                    stepSize: Math.ceil(maxValue / 5000) * 1000, // Create about 5 steps
                    display: false,
                  }
                }
              }
            };
          },
          error: (error) => {
            console.error('Failed to load data:', error);
          }
        });
      },
      error: (error) => {
        console.error('Failed to fetch userId:', error);
        sessionStorage.removeItem('finance.auth');
        this.router.navigate(['login']);
      }
    });
  }

  // Mixed Chart Configuration
  public mixedChartData: ChartData<'bar' | 'line'> = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        type: 'bar',
        label: 'Expenses',
        data: [50, 45, 60, 40, 35, 60, 50, 55, 70, 75, 80, 75],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        type: 'line',
        label: 'Savings',
        data: [60, 55, 65, 50, 45, 70, 63, 67, 90, 95, 90, 85],
        fill: false,
        borderColor: 'rgb(54, 162, 235)',
      },
    ],
  };

  public mixedChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Monthly Finance Overview',
        padding: 20,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  // Radar Chart Configuration
  public radarChartData: ChartData<'radar'> = {
    labels: ['Budgeting', 'Saving', 'Investing', 'Planning', 'Spending', 'Goals'],
    datasets: [
      {
        label: 'Target Status',
        data: [65, 59, 90, 81, 56, 55],
        fill: true,
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgb(255, 99, 132)',
        pointBackgroundColor: 'rgb(255, 99, 132)',
        pointBorderColor: '#fff',
      },
      {
        label: 'Current Status',
        data: [28, 48, 40, 19, 96, 27],
        fill: true,
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgb(54, 162, 235)',
        pointBackgroundColor: 'rgb(54, 162, 235)',
        pointBorderColor: '#fff',
      }
    ]
  };

  public radarChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Financial Health Analysis',
        padding: 20,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        ticks: {
          stepSize: 20
        }
      }
    }
  };
}
