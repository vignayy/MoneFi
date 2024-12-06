import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface UserProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
  profileImage: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile = {
    name: 'Kodi Bharadwaj',
    email: 'Bharadwaj.Kodi@ust.com',
    phone: '9381153612',
    address: 'Trivandrum, Kerala',
    profileImage: 'assets/default-profile.jpg'
  };

  isEditing = false;

  constructor() { }

  ngOnInit(): void { }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
  }

  onSaveProfile(): void {
    // Implement save logic here
    this.isEditing = false;
  }

  onImageUpload(event: any): void {
    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];

    if (file && allowedTypes.includes(file.type)) {
      if (file.size <= maxSize) {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.userProfile.profileImage = e.target.result;
        };
        reader.readAsDataURL(file);
      } else {
        alert('File is too large. Maximum size is 5MB.');
      }
    } else {
      alert('Please select a valid image file (JPEG, PNG, or GIF).');
    }
  }
}