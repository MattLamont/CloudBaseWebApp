import { Component } from '@angular/core';

import { RecipeService } from '../services/recipe.service';
import { SessionStorage } from 'ngx-webstorage';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent {

  @SessionStorage( 'user' )
  sessionUser;

  featured_recipes: any;
  recent_recipes: any;
  popular_recipes: any;

  view_type = 'cards';

  showFeaturedLoadMoreButton = true;
  showFeaturedLoadingSpinner = false;
  numFeaturedRecipes = 0;

  showRecentLoadMoreButton = true;
  showRecentLoadingSpinner = false;
  numRecentRecipes = 0;

  showPopularLoadMoreButton = true;
  showPopularLoadingSpinner = false;
  numPopularRecipes = 0;

  constructor(
    private recipeService: RecipeService
  ) {

    this.getMoreFeaturedRecipes();
    this.getMoreRecentRecipes();
    this.getMorePopularRecipes();

    if( this.sessionUser ){
      this.view_type = this.sessionUser.settings.recipe_display;
    }
  }

  getMoreFeaturedRecipes(){
    this.showFeaturedLoadingSpinner = true;
    this.recipeService
      .findRecipes(['owner'], `limit=6&skip=${this.numFeaturedRecipes}`)
      .subscribe(
      (recipes) => {

        if( !this.featured_recipes ) this.featured_recipes = recipes;
        else this.featured_recipes = this.featured_recipes.concat( recipes );

        if( recipes.length != 6 ){
          this.showFeaturedLoadMoreButton = false;
        }

        this.numFeaturedRecipes = this.featured_recipes.length;
        this.showFeaturedLoadingSpinner = false;
      },
      (error) => {

      });
  }

  getMoreRecentRecipes(){
    this.showRecentLoadingSpinner = true;
    this.recipeService
      .findRecipes(['owner'], `limit=6&sort=updatedAt%20DESC&skip=${this.numRecentRecipes}`)
      .subscribe(
      (recipes) => {

        if( !this.recent_recipes ) this.recent_recipes = recipes;
        else this.recent_recipes = this.recent_recipes.concat( recipes );

        if( recipes.length != 6 ){
          this.showRecentLoadMoreButton = false;
        }

        this.numRecentRecipes = this.recent_recipes.length;
        this.showRecentLoadingSpinner = false;
      },
      (error) => {

      });
  }

  getMorePopularRecipes(){
    this.showPopularLoadingSpinner = true;
    this.recipeService
      .findRecipes(['owner'], `sort=likes_count%20DESC&limit=6&skip=${this.numPopularRecipes}`)
      .subscribe(
      (recipes) => {

        if( !this.popular_recipes ) this.popular_recipes = recipes;
        else this.popular_recipes = this.popular_recipes.concat( recipes );

        if( recipes.length != 6 ){
          this.showPopularLoadMoreButton = false;
        }

        this.numPopularRecipes = this.popular_recipes.length;
        this.showPopularLoadingSpinner = false;
      },
      (error) => {

      });
  }

}
