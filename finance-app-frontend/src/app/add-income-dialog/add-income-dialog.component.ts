import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-add-income-dialog',
  templateUrl: './add-income-dialog.component.html',
  styleUrls: ['./add-income-dialog.component.scss'],
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
export class AddIncomeDialogComponent {
  incomeSource = {
    source: '',
    amount: '',
    date: new Date(),
    category: '',
    recurring: false
  };

  // // constructor(public dialogRef: MatDialogRef<AddIncomeDialogComponent>) {}
  // constructor(
  //   public dialogRef: MatDialogRef<AddIncomeDialogComponent>,
  //   @Inject(MAT_DIALOG_DATA) public data: any // Inject incoming data
  // ) {
  //   this.incomeSource = { ...data }; // Initialize form with pre-populated data
  // }
  dialogTitle: string;
  
  constructor(
    public dialogRef: MatDialogRef<AddIncomeDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any 
  ) {
    const dialogData = data || {}; 

    if (dialogData.isUpdate) {
      this.dialogTitle = 'Update Income'; 
      this.incomeSource = { ...dialogData }; 
    } else {
      this.dialogTitle = 'Add New Income'; 
      this.incomeSource =  { source: '',
      amount: '',
      date: new Date(),
      category: '',
      recurring: false}
    }
  }

  onSave() {
    this.dialogRef.close(this.incomeSource);
  }

  onCancel() {
    this.dialogRef.close();
  }
}