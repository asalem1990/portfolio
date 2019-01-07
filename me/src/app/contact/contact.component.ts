import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Http, Response, Headers, URLSearchParams, RequestOptions } from '@angular/http';



@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {


  rForm: FormGroup;
  email_address:string = '';
  full_name:string = '';
  mobile_number:string = '';
  message:string = '';

  isEmailSentStatus = false;
  isEmailSentMessage = "";

  constructor(public http: Http, public fb: FormBuilder) {
    this.rForm = fb.group({
      'email_address' : [null,Validators.required],
      'full_name' : [null,Validators.required],
      'mobile_number' : [null,Validators.required],
      'message' : [null,Validators.required]
    });
  }

  ngOnInit() {
  }


  email (options) {
    let data = options;


    this.http.post('/api/mail/send', data).subscribe(event => {
      this.isEmailSentStatus = event.json().status;
      this.isEmailSentMessage = event.json().message;
      if (this.isEmailSentStatus) {
        this.rForm.reset();
      }
    });
  }

}
