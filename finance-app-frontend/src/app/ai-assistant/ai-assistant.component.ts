import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from '@google/generative-ai';
import { environment } from '../../environments/environment.development';
import { ToastrService } from 'ngx-toastr';

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
  private genAI: GoogleGenerativeAI;

  constructor(private toastr:ToastrService) {
    this.genAI = new GoogleGenerativeAI(environment.API_KEY);
  }

  ngOnInit() {
    this.getFinancialAdvice();

  }

  async getFinancialAdvice(){
    this.advice = "Hello";
  }

  // async getFinancialAdvice(): Promise<void> {
  //   try {
  //     const generationConfig = {
  //       safetySettings: [
  //         {
  //           category: HarmCategory.HARM_CATEGORY_HARASSMENT,
  //           threshold: HarmBlockThreshold.BLOCK_LOW_AND_ABOVE,
  //         },
  //       ],
  //       temperature: 0.8,
  //       top_p: 0.9,
  //       maxOutputTokens: 200,
  //     };

  //     const model = this.genAI.getGenerativeModel({
  //       model: 'gemini-pro',
  //       ...generationConfig,
  //     });

  //     const prompt = `
  //       what is the best way to save money?
  //     `;

  //     const result = await model.generateContent(prompt);
  //     const responseText = result.response.text();
  //     // console.log(this.responseText);
  //     this.advice = responseText;
  //     this.toastr.success('AI advice generated successfully');

  //   } catch (error) {
  //     console.error('Error generating recommendations:', error);
  //     this.toastr.error('Failed to generate AI advice', 'Error');
  //   }
  // }

}
