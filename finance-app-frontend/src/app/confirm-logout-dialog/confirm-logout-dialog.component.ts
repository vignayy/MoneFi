// import { Component } from '@angular/core';
// import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
// import { NgIf } from '@angular/common';
// import { MatButtonModule } from '@angular/material/button';
// import { MatIconModule } from '@angular/material/icon';
// import { trigger, transition, style, animate } from '@angular/animations';

// @Component({
//   standalone: true,
//   selector: 'app-confirm-logout-dialog',
//   templateUrl: './confirm-logout-dialog.component.html',
//   styleUrls: ['./confirm-logout-dialog.component.scss'],
//   imports: [MatDialogModule, MatButtonModule, NgIf, MatIconModule],
//   animations: [
//     trigger('dialogAnimation', [
//       transition(':enter', [
//         style({ opacity: 0, transform: 'scale(0.7)' }),
//         animate('300ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
//       ]),
//       transition(':leave', [
//         animate('200ms ease-in', style({ opacity: 0, transform: 'scale(0.7)' }))
//       ])
//     ])
//   ]
// })
// export class ConfirmLogoutDialogComponent {
//   constructor(private dialogRef: MatDialogRef<ConfirmLogoutDialogComponent>) { }

//   onConfirm(): void {
//     this.dialogRef.close(true);
//   }

//   onCancel(): void {
//     this.dialogRef.close(false);
//   }
// }


import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-logout-dialog',
  templateUrl: './confirm-logout-dialog.component.html',
  styleUrls: ['./confirm-logout-dialog.component.scss'],
  standalone:true,
})
export class ConfirmLogoutDialogComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmLogoutDialogComponent>) {}

  confirmLogout(): void {
    this.dialogRef.close(true);
  }

  cancelLogout(): void {
    this.dialogRef.close(false);
  }
}
