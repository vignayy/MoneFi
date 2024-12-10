import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { async, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from './environments/environment';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private apiKey = environment.geminiApiKey;
  private apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  private genAi : GoogleGenerativeAI;
  constructor(private http: HttpClient) {
    this.genAi = new GoogleGenerativeAI(this.apiKey);
  }

  getFinancialAdviceGemini(currentMonthData: any, previousMonthData: any): Observable<string> {
    const prompt = `
      As a financial advisor, analyze the following monthly financial data and provide personalized advice:
      
       Monthly details:
      - ExpensesCurrentMonth: $${currentMonthData}
      - ExpensesPreviousMonth: $${previousMonthData}
      
  
      
      Please provide:
      1. A brief analysis of spending patterns
      2. Specific recommendations for improvement
      3. Savings opportunities
      4. Any concerning trends
      Keep the response concise and actionable.
    `;

    return this.http.post(`${this.apiUrl}?key=${this.apiKey}`, {
      prompt: {
        text: prompt
      }
    }).pipe(
      map((response: any) => response.candidates[0].content) // Adjust based on API response structure
    );
  
  }
}
