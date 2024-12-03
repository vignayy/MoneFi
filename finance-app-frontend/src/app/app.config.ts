// import { provideHttpClient, withInterceptors } from '@angular/common/http';
// import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
// import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';
// import { authInterceptor } from './auth.interceptor';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Correct import

// export const appConfig: ApplicationConfig = {
//   providers: [
//     provideRouter(routes),
//     provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync(),
//   ],
// };

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { authInterceptor } from './auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async'; // Correct import
import { provideAnimations } from '@angular/platform-browser/animations';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])), provideAnimationsAsync(),
    provideAnimations(), provideAnimationsAsync(), provideAnimationsAsync(),
  ],
};
