import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

@Component({
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [CommonModule, NgChartsModule]
})
export class HomeComponent {
  isLoggedIn: boolean = false;

  constructor(private router: Router) {}

    // Polar Area Chart Configuration
    public polarChartData: ChartData<'polarArea'> = {
      labels: ['Bills', 'Food', 'Transport', 'Shopping', 'Entertainment'],
      datasets: [{
        data: [11, 16, 7, 3, 14],
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(255, 205, 86, 0.7)',
          'rgba(150, 153, 157, 0.7)',
          'rgba(54, 162, 235, 0.7)',
        ],
      }]
    };
  
    public polarChartOptions: ChartConfiguration['options'] = {
      responsive: true,
      plugins: {
        legend: {
          position: 'right',
        },
        title: {
          display: true,
          text: 'Spending Analysis',
          font: {
            size: 24,
            family: 'Roboto',
          },
          color: '#1e3c72',
        }
      },
      scales: {
        r: {
          ticks: {
            display: false,
          },
          angleLines: {
            display: true,
          },
          grid: {
            circular: true,
          }
        }
      },
      backgroundColor: 'transparent'
    };
    
  // Mixed Chart Configuration
  // public mixedChartData: ChartData<'bar' | 'line'> = {
  //   labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  //   datasets: [
  //     {
  //       type: 'bar',
  //       label: 'Expenses',
  //       data: [50, 45, 60, 40, 35, 60, 50, 55, 70, 75, 80, 75],
  //       borderColor: 'rgb(255, 99, 132)',
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //     },
  //     {
  //       type: 'line',
  //       label: 'Savings',
  //       data: [60, 55, 65, 50, 45, 70, 63, 67, 90, 95, 90, 85],
  //       fill: false,
  //       borderColor: 'rgb(54, 162, 235)',
  //     },
  //   ],
  // };

  // public mixedChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       display: true,
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Monthly Finance Overview'
  //     }
  //   }
  // };


  // Radar Chart Configuration
  // public radarChartData: ChartData<'radar'> = {
  //   labels: ['Budgeting', 'Saving', 'Investing', 'Planning', 'Tracking', 'Goals'],
  //   datasets: [
  //     {
  //       label: 'Current Status',
  //       data: [65, 59, 90, 81, 56, 55],
  //       fill: true,
  //       backgroundColor: 'rgba(255, 99, 132, 0.2)',
  //       borderColor: 'rgb(255, 99, 132)',
  //       pointBackgroundColor: 'rgb(255, 99, 132)',
  //       pointBorderColor: '#fff',
  //     },
  //     {
  //       label: 'Target Status',
  //       data: [28, 48, 40, 19, 96, 27],
  //       fill: true,
  //       backgroundColor: 'rgba(54, 162, 235, 0.2)',
  //       borderColor: 'rgb(54, 162, 235)',
  //       pointBackgroundColor: 'rgb(54, 162, 235)',
  //       pointBorderColor: '#fff',
  //     }
  //   ]
  // };

  // public radarChartOptions: ChartConfiguration['options'] = {
  //   responsive: true,
  //   plugins: {
  //     legend: {
  //       position: 'top',
  //     },
  //     title: {
  //       display: true,
  //       text: 'Financial Health Analysis'
  //     }
  //   }
  // };

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  // logout(): void {
  //   this.isLoggedIn = false;
  //   this.router.navigate(['/home']);
  // }
}
