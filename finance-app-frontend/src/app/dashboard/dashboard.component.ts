import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomeComponent } from '../income/income.component';
import { ExpensesComponent } from '../expenses/expenses.component';
import { BudgetsComponent } from '../budgets/budgets.component';
import { GoalsComponent } from '../goals/goals.component';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { OverviewComponent } from '../overview/overview.component';
import { ConfirmLogoutDialogComponent } from '../confirm-logout-dialog/confirm-logout-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IncomeComponent,
    ExpensesComponent,
    BudgetsComponent,
    GoalsComponent,
    OverviewComponent,
    ConfirmLogoutDialogComponent
  ]
})
export class DashboardComponent {

  constructor(private router:Router, private dialog: MatDialog, private route: ActivatedRoute){};

  activeSection: string = 'overview';

  setActiveSection(section: string) {
    this.activeSection = section;
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      if (params['section']) {
        this.activeSection = params['section'];
      }
    });
  }

  logoutUser(): void {
    const dialogRef = this.dialog.open(ConfirmLogoutDialogComponent, {
      width: '450px',
      panelClass: 'custom-dialog-container',
      disableClose: true, // Prevents closing by clicking outside
      position: { top: '100px' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        setTimeout(() => {
          sessionStorage.removeItem('finance.auth');
          this.router.navigate(['']);
        }, 300);
      }
    });
  }

  
}

