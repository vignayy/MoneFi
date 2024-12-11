import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Chart, ChartConfiguration, ChartData } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';

@Component({
  selector: 'app-analysis',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './analysis.component.html',
  styleUrl: './analysis.component.css'
})
export class AnalysisComponent {
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
