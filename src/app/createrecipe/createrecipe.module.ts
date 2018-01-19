import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';

import { CreateRecipeComponent } from './createrecipe.component';
import { CreateRecipeRoutes } from './createrecipe.routing';

import { FlavorService } from '../services/flavor.service';
import { RecipeService } from '../services/recipe.service';
import { UploadService } from '../services/upload.service';

import {ImageCropperComponent, CropperSettings, Bounds} from 'ng2-img-cropper';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreateRecipeRoutes),
    NgbProgressbarModule, NgbTabsetModule,
    NgbModule,
    NgxChartsModule,
    FormsModule
  ],
  declarations: [
    CreateRecipeComponent,
    ImageCropperComponent
  ],
  providers: [
    FlavorService,
    RecipeService,
    UploadService
  ]
})

export class CreateRecipeModule { }
