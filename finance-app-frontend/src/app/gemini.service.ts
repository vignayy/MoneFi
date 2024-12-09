import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiKey = environment.geminiApiKey;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(
    private http: HttpClient
  ) {}

  getFinancialAdvice(currentMonthData: any, previousMonthData: any): Observable<string> {
    const prompt = `
      As a financial advisor, analyze the following monthly financial data and provide personalized advice:
      
       Monthly details:
      - ExpensesPreviousMonth: $${currentMonthData}
      - ExpensesCurrentMonth: $${previousMonthData}
      
  
      
      Please provide:
      1. A brief analysis of spending patterns
      2. Specific recommendations for improvement
      3. Savings opportunities
      4. Any concerning trends
      Keep the response concise and actionable.
    `;

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, {
      contents: [{
        parts: [{
          text: prompt
        }]
      }]
    }).pipe(
      map((response: any) => response.candidates[0].content.parts[0].text)
    );
  }
}
