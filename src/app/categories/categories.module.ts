import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module'
import { InfiniteScrollModule } from 'ngx-infinite-scroll';;

import { CategoriesComponent } from './categories.component';
import { CategoriesRoutes } from './categories.routing';

import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CategoriesRoutes),
    SharedModule,
    InfiniteScrollModule
  ],
  declarations: [
    CategoriesComponent
  ],
  providers: [
    RecipeService,
    UserService
  ]
})

export class CategoriesModule { }
