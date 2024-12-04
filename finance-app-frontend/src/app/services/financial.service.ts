import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FinancialService {
  private apiUrl = 'http://localhost:8765';

  constructor(private http: HttpClient) {}

  getFinancialSummary(): Observable<any> {
    return forkJoin({
      income: this.http.get(`${this.apiUrl}/income`),
      expenses: this.http.get(`${this.apiUrl}/expenses`),
      budgets: this.http.get(`${this.apiUrl}/budgets`),
      goals: this.http.get(`${this.apiUrl}/goals`)
    }).pipe(
      map(data => {
        // Transform the data as needed
        return {
          income: (data.income as any).total,
          expenses: (data.expenses as any).total,
          savings: (data.income as any).total - (data.expenses as any).total,
          budgetProgress: ((data.expenses as any).total / (data.budgets as any).limit) * 100,
          goalsProgress: (data.goals as any).progress
        };
      })
    );
  }
} 