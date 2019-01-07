import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import { SortablejsOptions } from 'angular-sortablejs';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  projectsList;
  companies;

  newProject;
  newProjectForm;
  editProject;
  cards;
  projectsListIDs = [];
  sortEnabled = false;

  projectGalleryInModal;

  constructor(public http: Http) {
    this.newProject = {};
    this.newProjectForm=false;
    this.editProject = {};
    this.cards = [];
    this.projectGalleryInModal=[];
  }

  ngOnInit() {
      this.http.get('/api/get/projects').map((response) => {
          this.projectsList = response.json().map((elem) => {
            elem.screenshots = JSON.parse(elem.screenshots != "" ? elem.screenshots : "[]");
            return elem;
          });
      }).toPromise();
      this.projectsListIDs = this.projectsList.map(row=> {
        return row.id;
      });
      this.http.get('/api/get/experience').map((response) => {
        this.companies = response.json();
      }).toPromise();
  }

  ngAfterViewChecked(){
    this.cards = document.querySelectorAll('.cardContainer>.card');
    this.cards.forEach(item => {
      item.style.height = item.querySelector(".side.front").clientHeight + "px";
    });
  }

  transition(index = 0) {
    if (this.cards[index].classList.contains('active')) {
      this.cards[index].classList.remove('active')
    } else {
      this.cards[index].classList.add('active');
    }
  }

  onProjectScreenshotAdded(event) {
    let newImage = event.target.files[0];
    let uploadData = new FormData();
    uploadData.append('myFile', newImage, newImage.name);
    this.http.post('/api/project/screenshot/upload', uploadData).subscribe(event => {
      if(this.newProjectForm) {
        if (this.newProject.screenshots == undefined) {
          this.newProject.screenshots = [];
        }
        this.newProject.screenshots.push(JSON.parse(event["_body"]).path);
      } else {
        if (this.editProject.screenshots == undefined) {
          this.editProject.screenshots = [];
        }
        this.editProject.screenshots.push(JSON.parse(event["_body"]).path);
      }
    });
  }

  publishProjectItem() {
    let data = this.newProject;
    if (this.editProject.id) {
      data = this.editProject;
    }
    data.screenshots = JSON.stringify(data.screenshots)

    this.http.post('/api/project/publish', data).subscribe(event => {
      this.newProject = {};
      this.editProject = {};
      this.newProjectForm = false;
      this.http.get('/api/get/projects').map((response) => {
          this.projectsList = response.json().map((elem) => {
            elem.screenshots = JSON.parse(elem.screenshots != "" ? elem.screenshots : "[]");
            return elem;
          });
      }).toPromise();
    });
  }

  validateProjectForm(){
    if (this.editProject.id && (!this.editProject.screenshots || !this.editProject.screenshots.length || !this.editProject.title || !this.editProject.description || !this.editProject.tags))
      return false;

    if(!this.editProject.id && (!this.newProject.screenshots || !this.newProject.screenshots.length || !this.newProject.title || !this.newProject.description || !this.newProject.tags))
      return false;

    return true;
  }

  removeProjectItem(id) {
    let data = {id: id};
    this.http.post('/api/project/remove', data).subscribe(event => {
      this.newProject = {};
      this.editProject = {};
      this.newProjectForm = false;
      this.http.get('/api/get/projects').map((response) => {
          this.projectsList = response.json().map((elem) => {
            elem.screenshots = JSON.parse(elem.screenshots != "" ? elem.screenshots : "[]");
            return elem;
          });
      }).toPromise();
    });
  }

  projectsListOptions: SortablejsOptions = {
    onUpdate: () => {
      this.sortEnabled = true;
    }
  };

  publishSort() {
    let newSort = this.projectsListIDs;
    this.projectsListIDs = this.projectsList.map(row=> {
      return row.id;
    });

    if(newSort != this.projectsListIDs) {
      console.log(this.projectsListIDs);
      this.http.post('/api/projects/sort', this.projectsListIDs).subscribe(event => {
        this.sortEnabled = false;
      });
    }
  }
}