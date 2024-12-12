import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AiService } from '../services/ai.service';
import { finalize } from 'rxjs/operators';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent {
  advice: string = '';
  loading: boolean = false;
  error: string | null = null;
  baseUrl = "http://localhost:8765";

  public lineChartData: ChartData<'line'> = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Cumulative Savings',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.1)',
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          padding: 20,
          font: { size: 12 }
        }
      },
      title: {
        display: true,
        text: 'Cumulative Savings Growth',
        padding: 20,
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => '₹' + value.toLocaleString()
        }
      }
    }
  };

  constructor(
    private aiService: AiService,
    private toastr: ToastrService,
    private httpClient: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCumulativeData();
  }

  loadCumulativeData() {
    const token = sessionStorage.getItem('finance.auth');
    const currentYear = new Date().getFullYear();

    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        this.httpClient.get<number[]>(`${this.baseUrl}/api/user/${userId}/monthlyCumulativeSavingsInYear/${currentYear}`)
          .subscribe({
            next: (cumulativeData) => {
              this.lineChartData.datasets[0].data = cumulativeData;
              
              // Update chart options for better scale
              const maxValue = Math.max(...cumulativeData);
              this.lineChartOptions = {
                ...this.lineChartOptions,
                scales: {
                  y: {
                    beginAtZero: true,
                    max: Math.ceil(maxValue / 10000) * 10000,
                    ticks: {
                      stepSize: Math.ceil(maxValue / 50000) * 10000,
                      callback: (value) => '₹' + value.toLocaleString()
                    }
                  }
                }
              };
            },
            error: (error) => {
              console.error('Failed to load cumulative data:', error);
              this.toastr.error('Failed to load chart data', 'Error');
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

  getFinancialAdvice(): void {
    this.loading = true;
    this.error = null;

    const prompt = `
      what is the full form of the word "AI"
    `;

    this.aiService.getAiResponse(prompt)
      .pipe(
        finalize(() => this.loading = false)
      )
      .subscribe({
        next: (response) => {
          this.advice = response;
          this.toastr.success('AI advice generated successfully');
        },
        error: (error) => {
          this.error = 'Failed to generate AI advice';
          this.toastr.error(this.error, 'Error');
          console.error('AI Service Error:', error);
        }
      });
  }
}