import { HttpClientModule, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ToastrModule } from 'ngx-toastr';
import { DateAdapter, MatNativeDateModule, MAT_DATE_LOCALE, NativeDateAdapter, provideNativeDateAdapter } from '@angular/material/core';
import { GeminiService } from './gemini.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync(), importProvidersFrom(ToastrModule.forRoot()),
    provideNativeDateAdapter(),
  ],
};
