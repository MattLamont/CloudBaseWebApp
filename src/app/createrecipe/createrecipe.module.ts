import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { ImageCropperModule } from 'ng2-img-cropper';

import { CreateRecipeComponent } from './createrecipe.component';
import { CreateRecipeRoutes } from './createrecipe.routing';

import { FlavorService } from '../services/flavor.service';
import { RecipeService } from '../services/recipe.service';
import { UploadService } from '../services/upload.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreateRecipeRoutes),
    NgbProgressbarModule, NgbTabsetModule,
    NgbModule,
    NgxChartsModule,
    FormsModule,
    ImageCropperModule
  ],
  declarations: [
    CreateRecipeComponent,
  ],
  providers: [
    FlavorService,
    RecipeService,
    UploadService
  ]
})

export class CreateRecipeModule { }
