import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skillsList;
  skillsListCategoriesed;
  skillsCategories;

  constructor(public http: Http) {}

  ngOnInit() {
      this.http.get('/api/get/skills').map((response) => {
          this.skillsList = response.json();
          this.skillsListCategoriesed = {};
          this.skillsCategories = [];
          this.skillsList.map(row => {
            if (!this.skillsListCategoriesed[`${row.category}`]) {
              this.skillsListCategoriesed[`${row.category}`] = [];
            }
            if(!this.skillsCategories.includes(row.category)) {
              this.skillsCategories.push(row.category);
            }
            this.skillsListCategoriesed[`${row.category}`].push(row);
          });
      }).toPromise();
  }
}
