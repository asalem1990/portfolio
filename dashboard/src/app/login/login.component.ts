import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http } from '@angular/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  user = {
    username: "",
    password: ""
  };
  error = false;

  constructor(private router: Router, public http: Http) {
    if (localStorage.getItem('token')) {
      this.router.navigateByUrl('/');
    }
  }

  onLogin(): void {
    let data = this.user;
    this.http.post('/api/auth/login', data).subscribe(event => {
        if(event.json().status == 500) {
          this.error = true;
        } else {
          localStorage.setItem('token', event.json().token);
          this.router.navigateByUrl('');
        }
    });
  }

  ngOnInit() {
  }

}
