import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddIncomeDialogComponent } from '../add-income-dialog/add-income-dialog.component';

@Component({
  selector: 'app-add-budget-dialog',
  standalone: true,
  imports: [FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule],
  templateUrl: './add-budget-dialog.component.html',
  styleUrl: './add-budget-dialog.component.scss'
})
export class AddBudgetDialogComponent {
  budgetSource = {
    category: '',
    currentSpending:0,
    moneyLimit:''
  };
  constructor(public dialogRef: MatDialogRef<AddIncomeDialogComponent>) {}
  onSave() {
    this.dialogRef.close(this.budgetSource);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
