import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Http } from '@angular/http';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss']
})
export class AboutComponent implements OnInit {
  data;

  newAboutMeForm;

  public Editor = ClassicEditor;
  isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;
    for (var c = a.childNodes, i = c.length; i--; ) {
      if (c[i].nodeType == 1) return true;
    }
    return false;
  }

  constructor(public http: Http, private sanitizer:DomSanitizer) {
    this.newAboutMeForm = false;
  }
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

  publishNewAboutMe() {
    if (!this.isHTML(this.data.about_me)) {
      this.data.about_me = "<p>" + this.data.about_me + "</p>";
    }
    this.http.post('/api/about_me/publish', {aboutme: this.data.about_me}).subscribe(event => {
      this.newAboutMeForm = false;
    });
  }

  validateNewAboutMeForm(){
    if(!this.data.about_me)
      return false;
    return true;
  }

  public onChangeDescriptionEditor( { editor }: ChangeEvent ) {
    return editor.getData();
  }
}
