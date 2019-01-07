import { Component, ViewEncapsulation, OnInit } from '@angular/core';
import { NavComponent } from '../nav/nav.component';
import { WelcomeComponent } from '../welcome/welcome.component';
import { ExperienceComponent } from '../experience/experience.component';
import { SkillsComponent } from '../skills/skills.component';
import { PortfolioComponent } from '../portfolio/portfolio.component';
import { AboutComponent } from '../about/about.component';

@Component({
  selector: 'app-root',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PageComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
