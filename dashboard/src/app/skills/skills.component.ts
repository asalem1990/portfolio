import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.scss']
})
export class SkillsComponent implements OnInit {
  skillsList;
  skillsListCategoriesed;
  skillsCategories;

  newSkill;
  newSkillForm;
  editSkill;
  skillsListIDs = [];
  sortEnabled = false;

  constructor(public http: Http) {
    this.newSkill = {};
    this.newSkillForm=false;
    this.editSkill = {};
  }

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
          this.skillsListIDs = this.skillsList.map(row=> {
            return row.id;
          });
      }).toPromise();

  }

  onSkillIconChanged(event) {
    let newImage = event.target.files[0];
    let uploadData = new FormData();
    uploadData.append('myFile', newImage, newImage.name);
    this.http.post('/api/skill/logo/upload', uploadData).subscribe(event => {
      if(this.newSkillForm) {
        this.newSkill.icon = JSON.parse(event["_body"]).path;
      } else {
        this.editSkill.icon = JSON.parse(event["_body"]).path;
      }
    });
  }

  publishSkillItem() {
    let data = this.newSkill;
    if (this.editSkill.id) {
      data = this.editSkill;
    }

    this.http.post('/api/skill/publish', data).subscribe(event => {
      this.newSkill = {};
      this.editSkill = {};
      this.newSkillForm = false;
      this.http.get('/api/get/skills').map((response) => {
          this.skillsList = response.json()
      }).toPromise();
    });

  }

  validateSkillForm(){
    if (this.editSkill.id && (!this.editSkill.icon || !this.editSkill.title || !this.editSkill.years_of_experience || !this.editSkill.category))
      return false;
    if(!this.editSkill.id && (!this.newSkill.icon || !this.newSkill.title || !this.newSkill.years_of_experience || !this.newSkill.category))
      return false;
    return true;
  }

  removeSkillItem(id) {
    let data = {id: id};
    this.http.post('/api/skill/remove', data).subscribe(event => {
      this.newSkill = {};
      this.editSkill = {};
      this.newSkillForm = false;
      this.http.get('/api/get/skills').map((response) => {
          this.skillsList = response.json()
      }).toPromise();
    });
  }


  skillsListOptions: SortablejsOptions = {
    onUpdate: () => {
      this.sortEnabled = true;
    }
  };

  publishSort() {
    let newSort = this.skillsListIDs;
    this.skillsListIDs = this.skillsList.map(row=> {
      return row.id;
    });

    if(newSort != this.skillsListIDs) {
      console.log(this.skillsListIDs);
      this.http.post('/api/skills/sort', this.skillsListIDs).subscribe(event => {
        this.sortEnabled = false;
      });
    }
  }
}
