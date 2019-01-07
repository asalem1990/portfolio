import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { ExperienceComponent } from './experience/experience.component';
import { SkillsComponent } from './skills/skills.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { AboutComponent } from './about/about.component';
import { ContactComponent } from './contact/contact.component';
import 'rxjs/Rx';
import { LoginComponent } from './login/login.component';
import { PageComponent } from './page/page.component';
import { SortablejsModule } from 'angular-sortablejs';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    ExperienceComponent,
    SkillsComponent,
    PortfolioComponent,
    AboutComponent,
    ContactComponent,
    LoginComponent,
    PageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    CKEditorModule,
    RouterModule.forRoot([
      { path: 'login', component: LoginComponent },
      { path: '', component: PageComponent }
    ]),
    SortablejsModule.forRoot({ animation: 150 }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
