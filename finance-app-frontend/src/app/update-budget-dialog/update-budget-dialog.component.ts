import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-update-budget-dialog',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  CommonModule,
ReactiveFormsModule],
  templateUrl: './update-budget-dialog.component.html',
  styleUrl: './update-budget-dialog.component.css'
})
export class UpdateBudgetDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<UpdateBudgetDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      budgets: this.fb.array(this.data.budgets.map((budget: any) => this.createBudgetForm(budget))),
    });
  }

  createBudgetForm(budget: any): FormGroup {
    return this.fb.group({
      id: [budget.id],
      category: [budget.category],
      moneyLimit: [budget.moneyLimit],
      currentSpending: [budget.currentSpending],
    });
  }

  get budgets(): FormArray {
    return this.form.get('budgets') as FormArray;
  }

  save() {
    this.dialogRef.close(this.form.value.budgets);
  }

  cancel() {
    this.dialogRef.close();
  }
}