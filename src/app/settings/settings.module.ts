import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import {ImageUploadModule} from 'angular2-image-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { SettingsComponent } from './settings.component';
import { SettingsRoutes } from './settings.routing';

import { UserService } from '../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(SettingsRoutes),
    NgbProgressbarModule, NgbTabsetModule,
    ImageUploadModule.forRoot(),
    NgbModule,
    FormsModule
  ],
  declarations: [
    SettingsComponent
  ],
  providers: [
    UserService,
  ]
})

export class SettingsModule { }
