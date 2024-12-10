import { Component, OnInit } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { HttpClient } from '@angular/common/http';
import { forkJoin, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent implements OnInit {
  advice: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(private geminiService: GeminiService, private http: HttpClient) {}

  ngOnInit() {
    this.getFinancialAdvice();
  }

  getFinancialAdvice() {
    this.loading = true;
    this.error = null;

    // Example API calls to your backend
    console.log("getFinancialAdvice");
    forkJoin({
      currentMonthExpense: this.http.get('http://localhost:8765/api/user/expenses/19/12/2024'),
      previousMonthExpense: this.http.get('http://localhost:8765/api/user/expenses/19/11/2024')
    }).pipe(
      switchMap(({ currentMonthExpense, previousMonthExpense }) => {
        console.log(currentMonthExpense, previousMonthExpense);
        const val = this.geminiService.getFinancialAdviceGemini(currentMonthExpense, previousMonthExpense);
        console.log(val);
        return val;
      })
    ).subscribe({
      next: (advice) => {
        this.advice = advice;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to get AI advice. Please try again later.';
        this.loading = false;
        console.error('Error:', error);
      }
    });
  }

}
