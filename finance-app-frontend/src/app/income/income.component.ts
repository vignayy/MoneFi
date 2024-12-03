import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';

interface IncomeSource {
  id: number;
  source: string;
  amount: number;
  date: string;
  category: string;
  recurring: boolean;
}

interface AddIncomeDialogResult {
  source: string;
  amount: number;
  date: string;
  category: string;
  recurring: boolean;
}

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  standalone: true,
  imports: [CommonModule]
})
export class IncomeComponent {
  totalIncome: number = 0;
  incomeSources: IncomeSource[] = [];
  loading: boolean = false;

  constructor(
    public httpClient: HttpClient
  ) {}

  baseUrl = "http://localhost:8765";
  

  ngOnInit() {
    this.loadIncomeData();
  }

  // loadIncomeData() {
  //   this.loading = true;
  //   const token = sessionStorage.getItem('finance.auth');
  //   console.log(token);
  //   const userId = this.httpClient.get<number>(`${this.baseUrl}/token/${token}`);
  //   console.log(userId);

  //   this.httpClient.get<IncomeSource[]>(`${this.baseUrl}/api/user/${userId}/incomes`).subscribe({
  //     next: (data) => {
  //       this.incomeSources = data;
  //       this.calculateTotalIncome();
  //     },
  //     error: (error) => {
  //       console.error('Failed to load income data:', error);
  //     },
  //     complete: () => {
  //       this.loading = false;
  //     }
  //   });
  // }
  loadIncomeData() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
    console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        console.log(userId);
  
        this.httpClient.get<IncomeSource[]>(`${this.baseUrl}/api/user/${userId}/incomes`).subscribe({
          next: (data) => {
            this.incomeSources = data;
            this.calculateTotalIncome();
          },
          error: (error) => {
            console.error('Failed to load income data:', error);
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Failed to fetch userId:', error);
        this.loading = false;
      }
    });
  }
  

  calculateTotalIncome() {
    this.totalIncome = this.incomeSources.reduce((sum, source) => sum + source.amount, 0);
  }

  addIncome() {
    
  }
}