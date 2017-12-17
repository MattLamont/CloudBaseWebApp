import { Component } from '@angular/core';

import { RecipeService } from '../services/recipe.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  recipes: any;

  constructor(
    private recipeService: RecipeService
  ) {

    this.recipeService
      .findRecipes()
      .subscribe(
      (recipes) => {
        this.recipes = recipes;
      },
      (error) => {

      });
  }
}
