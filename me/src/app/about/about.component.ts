import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  data;

  constructor(public http: Http, private sanitizer:DomSanitizer) {}
  sanitize(url:string){
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }
  ngOnInit() {
    this.http.get('/api/get/about_me').map((response) => {
      this.data = {
        about_me: response.json()[0].about_me,
        full_name: "Abdullah Mah'd Salem",
        position_title: "UI Software Engineer",
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
      };
    }).toPromise();
  }
}
