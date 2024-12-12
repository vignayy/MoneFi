import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { AiService } from '../services/ai.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-assistant.component.html',
  styleUrl: './ai-assistant.component.scss'
})
export class AiAssistantComponent {
  advice: string = '';
  loading: boolean = false;
  error: string | null = null;

  constructor(
    private aiService: AiService,
    private toastr: ToastrService
  ) {}

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