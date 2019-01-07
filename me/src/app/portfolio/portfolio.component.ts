import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {
  projectsList;
  companies;

  cards;

  projectGalleryInModal;

  constructor(public http: Http) {
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
}