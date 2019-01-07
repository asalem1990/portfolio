import { Component, OnInit } from '@angular/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ChangeEvent } from '@ckeditor/ckeditor5-angular/ckeditor.component';
import { Http } from '@angular/http';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
  selector: 'app-experience',
  templateUrl: './experience.component.html',
  styleUrls: ['./experience.component.scss']
})
export class ExperienceComponent implements OnInit {
  experienceList;

  newExperience;
  newExperienceForm;
  editExperience;
  experienceListIDs = [];
  sortEnabled = false;


  public Editor = ClassicEditor;
  isHTML(str) {
    var a = document.createElement('div');
    a.innerHTML = str;
    for (var c = a.childNodes, i = c.length; i--; ) {
      if (c[i].nodeType == 1) return true;
    }
    return false;
  }

  constructor(public http: Http) {
    this.newExperience = {};
    this.newExperienceForm = false;
    this.editExperience = {};
  }

  ngOnInit() {
    this.http.get('/api/get/experience').map((response) => {
      this.experienceList = response.json();
      this.experienceListIDs = this.experienceList.map(row=> {
        return row.id;
      });
    }).toPromise();
  }

  onCompanyLogoChanged(event) {
    let newImage = event.target.files[0];
    let uploadData = new FormData();
    uploadData.append('myFile', newImage, newImage.name);
    this.http.post('/api/company/logo/upload', uploadData).subscribe(event => {
      if(this.newExperienceForm) {
        this.newExperience.company_logo = JSON.parse(event["_body"]).path;
      } else {
        this.editExperience.company_logo = JSON.parse(event["_body"]).path;
      }
    });
  }

  publishNewExperience() {
    let data = this.newExperience;
    if (this.editExperience.id) {
      data = this.editExperience;
    }
    if (!this.isHTML(data.description)) {
      data.description = "<p>" + data.description+ "</p>";
    }
    this.http.post('/api/experience/publish', data).subscribe(event => {
      this.newExperience = {};
      this.editExperience = {};
      this.newExperienceForm = false;
      this.http.get('/api/get/experience').map((response) => {
        this.experienceList = response.json()
      }).toPromise();
    });
  }

  validateNewExperienceForm(){
    if(!this.newExperience.company_logo || !this.newExperience.company || !this.newExperience.company_location || !this.newExperience.position || !this.newExperience.description || !this.newExperience.start_date)
      return false;
    return true;
  }

  validateEditExperienceForm(){
    if(!this.editExperience.id || !this.editExperience.company_logo || !this.editExperience.company || !this.editExperience.company_location || !this.editExperience.position || !this.editExperience.description || !this.editExperience.start_date)
      return false;
    return true;
  }

  removeExperienceItem(id) {
    let data = {id: id};
    this.http.post('/api/experience/remove', data).subscribe(event => {
      this.newExperience = {};
      this.editExperience = {};
      this.newExperienceForm = false;
    });
  }

  public onChangeDescriptionEditor( { editor }: ChangeEvent ) {
    return editor.getData();
  }

  experienceListOptions: SortablejsOptions = {
    onUpdate: () => {
      this.sortEnabled = true;
    }
  };

  publishSort() {
    let newSort = this.experienceListIDs;
    this.experienceListIDs = this.experienceList.map(row=> {
      return row.id;
    });

    if(newSort != this.experienceListIDs) {
      console.log(this.experienceListIDs);
      this.http.post('/api/experience/sort', this.experienceListIDs).subscribe(event => {
        this.sortEnabled = false;
      });
    }
  }
}