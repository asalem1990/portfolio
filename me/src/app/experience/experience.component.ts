import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  experienceList;

  constructor(public http: Http) {}

  ngOnInit() {
    this.http.get('/api/get/experience').map((response) => {
      this.experienceList = response.json()
    }).toPromise();
  }
}