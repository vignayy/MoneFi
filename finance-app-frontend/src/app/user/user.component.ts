import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent {

  constructor(private authClient:HttpClient){}

  baseUrl = "http://localhost:8765";
  submitFunction(){
    this.authClient.get<string>(this.baseUrl+"/api/user/hello", { responseType: 'text' as 'json' })
    .subscribe (
      response => {
        console.log(response);
      }
    )
  }

}
