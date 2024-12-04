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
  selector: 'app-add-goal-dialog',
  standalone: true,
  templateUrl: './add-goal-dialog.component.html',
  styleUrl: './add-goal-dialog.component.scss',
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
export class AddGoalDialogComponent {
  goalSource = {
    goalName:'',
    currentAmount: 0,
    targetAmount:'',
    deadLine: new Date(),
    category: '',
  };

  constructor(public dialogRef: MatDialogRef<AddIncomeDialogComponent>) {}

  onSave() {
    // console.log(this.goalSource);
    this.dialogRef.close(this.goalSource);
  }
  // onSave() {
  //   const formattedGoalSource = {
  //     ...this.goalSource,
  //     date: this.formatDate(this.goalSource.date) // Convert date to string
  //   };
  
  //   this.dialogRef.close(formattedGoalSource);
  // }
  
  // formatDate(date: Date): string {
  //   const yyyy = date.getFullYear();
  //   const mm = String(date.getMonth() + 1).padStart(2, '0');
  //   const dd = String(date.getDate()).padStart(2, '0');
  //   return `${yyyy}-${mm}-${dd}`; // Returns date in 'YYYY-MM-DD' format
  // }
  

  onCancel() {
    this.dialogRef.close();
  }
}
