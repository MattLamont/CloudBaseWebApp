import { Component } from '@angular/core';

import { RecipeService } from '../services/recipe.service';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  featured_recipes: any;
  recent_recipes: any;
  popular_recipes: any;

  view_type = 'cards';

  constructor(
    private recipeService: RecipeService
  ) {

    this.recipeService
      .findRecipes(['owner'], 'limit=6')
      .subscribe(
      (recipes) => {
        this.featured_recipes = recipes;
      },
      (error) => {

      });

    this.recipeService
      .findRecipes(['owner'], 'sort=updatedAt%20ASC&limit=6')
      .subscribe(
      (recipes) => {
        this.recent_recipes = recipes;
      },
      (error) => {

      });

    this.recipeService
      .findRecipes(['owner'], 'skip=10&limit=6')
      .subscribe(
      (recipes) => {
        this.popular_recipes = recipes;
      },
      (error) => {

      });
  }

}
