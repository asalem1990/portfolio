import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  data;
  constructor(private router: Router, private sanitizer:DomSanitizer) {
    this.data = {
      social_channels: [
        {
          "title" : "GitHub",
          "URL" : "https://github.com/asalem1990",
          "icon": "assets/contact/github.svg"
        },
        {
          "title" : "Linkedin",
          "URL" : "https://www.linkedin.com/in/abdullah-salem-317010a2?trk=hp-identity-photo",
          "icon": "assets/contact/linkedin.svg"
        },
        {
          "title" : "Add to Skype",
          "URL" : "skype:asalem1990?add",
          "icon": "assets/contact/skype.svg"
        },
        {
          "title" : "Call on Mobile",
          "URL" : "tel:00962790560340",
          "icon": "assets/contact/phone.svg"
        },
        {
          "title" : "Send an Email",
          "URL" : "mailto:hey@ninjitsu.co",
          "icon": "assets/contact/mail.svg"
        }
      ]
    }
  }
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  ngOnInit() {
  }
}
