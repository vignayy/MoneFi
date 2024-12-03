import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]  // Required for *ngIf and routerLink
})
export class HeaderComponent {
  isLoggedIn: boolean = false;
  isMenuOpen: boolean = false;

  constructor(public router: Router) {}

  isRouteActive(route: string): boolean {
    return this.router.url === route;
  }

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
    this.isMenuOpen = false;
  }

  logout(): void {
    this.isLoggedIn = false;
    this.router.navigate(['/home']);
  }
}