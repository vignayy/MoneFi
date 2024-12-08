import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { AddIncomeDialogComponent } from '../add-income-dialog/add-income-dialog.component';

@Component({
  selector: 'app-add-income-dialog',
  templateUrl: './add-expense-dialog.component.html',
  styleUrls: ['./add-expense-dialog.component.scss'],
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
    MatIconModule
  ]
})
export class AddExpenseDialogComponent {
  expenseSource = {
    amount: 0,
    date: new Date(),
    category: '',
    description:'',
    recurring: false,
  };

  dialogTitle: string;
  
  constructor(
    public dialogRef: MatDialogRef<AddIncomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    const dialogData = data || {}; 

    if (dialogData.isUpdate) {
      this.dialogTitle = 'Update Expense'; 
      this.expenseSource = { ...dialogData }; 
    } else {
      this.dialogTitle = 'Add New Expense'; 
      this.expenseSource =  {amount: 0,
        date: new Date(),
        category: '',
        description:'',
        recurring: false,}
    }
  }

  onSave() {
    this.dialogRef.close(this.expenseSource);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
