import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import {ImageUploadModule} from 'angular2-image-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';

import { CreateRecipeComponent } from './createrecipe.component';
import { CreateRecipeRoutes } from './createrecipe.routing';

import { UserService } from '../services/user.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreateRecipeRoutes),
    NgbProgressbarModule, NgbTabsetModule,
    ImageUploadModule.forRoot(),
    NgbModule,
    NgxChartsModule
  ],
  declarations: [
    CreateRecipeComponent
  ],
  providers: [
    UserService
  ]
})

export class CreateRecipeModule { }
