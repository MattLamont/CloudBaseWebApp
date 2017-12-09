import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import {ImageUploadModule} from 'angular2-image-upload';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

import { CreateRecipeComponent } from './createrecipe.component';
import { CreateRecipeRoutes } from './createrecipe.routing';

import { FlavorService } from '../services/flavor.service';
import { RecipeService } from '../services/recipe.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreateRecipeRoutes),
    NgbProgressbarModule, NgbTabsetModule,
    ImageUploadModule.forRoot(),
    NgbModule,
    NgxChartsModule,
    FormsModule
  ],
  declarations: [
    CreateRecipeComponent
  ],
  providers: [
    FlavorService,
    RecipeService
  ]
})

export class CreateRecipeModule { }
