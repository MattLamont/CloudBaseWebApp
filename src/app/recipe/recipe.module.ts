import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule , ReactiveFormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';

import { recipeComponent } from './recipe.component';
import { recipeRoutes } from './recipe.routing';

import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { ReviewService } from '../services/review.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(recipeRoutes),
    NgbProgressbarModule, NgbTabsetModule,
    NgbModule,
    NgxChartsModule,
    FormsModule,
    ReactiveFormsModule,
    SidebarModule
  ],
  declarations: [
    recipeComponent
  ],
  providers: [
    RecipeService,
    UserService,
    ReviewService
  ]
})

export class RecipeModule { }
