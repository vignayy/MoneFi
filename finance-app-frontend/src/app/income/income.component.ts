import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { AddIncomeDialogComponent } from '../add-income-dialog/add-income-dialog.component';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface IncomeSource {
  id: number;
  source: string;
  amount: number;
  date: string;
  category: string;
  recurring: boolean;
}

@Component({
  selector: 'app-income',
  templateUrl: './income.component.html',
  styleUrls: ['./income.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FormsModule,
    MatInputModule,
    AddIncomeDialogComponent
  ]
})
export class IncomeComponent {
  totalIncome: number = 0;
  incomeSources: IncomeSource[] = [];
  loading: boolean = false;

  constructor(public httpClient: HttpClient,private dialog: MatDialog, private router:Router, private toastr:ToastrService) {};

  baseUrl = "http://localhost:8765";
  
  ngOnInit() {
    this.loadIncomeData();
  }

  loadIncomeData() {
    this.loading = true;
    const token = sessionStorage.getItem('finance.auth');
    // console.log(token);
  
    this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
      next: (userId) => {
        // console.log(userId);
  
        this.httpClient.get<IncomeSource[]>(`${this.baseUrl}/api/user/${userId}/incomes`).subscribe({
          next: (data) => {

            if (data && data.length > 0) {
              this.incomeSources = data; 
              this.calculateTotalIncome();
            } else {
              this.incomeSources = [];
              this.toastr.warning('No income data available for this user.', 'No Data');
              this.loading = false;
            }
          },
          error: (error) => {
            console.error('Failed to load income data:', error);
          },
          complete: () => {
            this.loading = false;
          }
        });
      },
      error: (error) => {
        console.error('Failed to fetch userId:', error);
        alert("Session timed out! Please login again");
        sessionStorage.removeItem('finance.auth');
        this.router.navigate(['login']);
        this.loading = false;
      }
    });
  }

  addIncome() {
    const dialogRef = this.dialog.open(AddIncomeDialogComponent, {
      width: '500px',
      panelClass: 'income-dialog',
    });
  
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = sessionStorage.getItem('finance.auth');
        console.log(token);
  
        this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
          next: (userId) => {
            console.log(userId);
            
            // Send POST request with the income data
            const incomeData = {
              ...result, // This should contain fields like source, amount, date, category, recurring, etc.
              userId: userId, // Add userId if your backend requires it
            };
            console.log(incomeData);
            this.httpClient.post<IncomeSource>(`${this.baseUrl}/api/user/${userId}/income`, incomeData, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }).subscribe({
              next: (newIncome) => {
                this.incomeSources.push(newIncome);
                this.calculateTotalIncome();
              },
              error: (error) => {
                console.error('Failed to add income data:', error);
              },
              complete: () => {
                this.loading = false;
              },
            });
          },
          error: (error) => {
            console.error('Failed to fetch userId:', error);
            this.loading = false;
          },
        });
      }
    });
  }

  calculateTotalIncome() {
    this.totalIncome = this.incomeSources.reduce((sum, source) => sum + source.amount, 0);
  }

  updateIncome(income: IncomeSource) {
    const dialogRef = this.dialog.open(AddIncomeDialogComponent, {
      width: '500px',
      panelClass: 'income-dialog',
      data: { ...income }, // Pass the income data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const token = sessionStorage.getItem('finance.auth');

        this.httpClient.get<number>(`${this.baseUrl}/auth/token/${token}`).subscribe({
          next : (userId) => {

            const updatedIncomeData = {
              ...result, // Updated fields from the dialog form
              userId: userId,
            };
            console.log(updatedIncomeData);

            this.httpClient.put<IncomeSource>(`${this.baseUrl}/api/user/${income.id}/income`, updatedIncomeData,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            ).subscribe({
              next: (updatedIncome) => {
                console.log('Income updated successfully:', updatedIncome);
                this.loadIncomeData(); 
              },
              error: (error) => {
                console.error('Failed to update income:', error);
              },
            });
          }
        })
  
        
      }
    });
  }
  

  deleteIncome(incomeId: number): void {
    console.log(incomeId);
    this.httpClient.delete<void>(`${this.baseUrl}/api/user/${incomeId}/income`)
      .subscribe({
        next: () => {
          console.log(`Income with ID ${incomeId} deleted successfully.`);
          this.loadIncomeData(); // Reload the data after successful deletion
        },
        error: (err) => {
          console.error('Error deleting income:', err);
        }
      });
  }
  

}