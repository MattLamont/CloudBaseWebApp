import { Component } from '@angular/core';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { AppHeaderService } from '../services/appheader.service';
import { ActivatedRoute , Router } from '@angular/router';


@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class recipeComponent {

  @LocalStorage('user')
  localUser;

  @SessionStorage('user')
  sessionUser;

  @SessionStorage('token')
  token;

  public recipe: any;

  public isRecipeLiked = false;
  public isRecipeDisliked = false;
  public isRecipeSaved = false;

  public likes = 0;
  public dislikes = 0;
  public saves = 0;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private appHeaderService: AppHeaderService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let recipeId = params['id'];
      this.recipeService
        .findOneRecipe( recipeId , ['flavors','owner','likes','dislikes','saves'] )
        .subscribe(
        (recipe) => {
          recipe.likes = recipe.likes.map( elem => elem.id );
          recipe.dislikes = recipe.dislikes.map( elem => elem.id );
          recipe.saves = recipe.saves.map( elem => elem.id );
          this.recipe = recipe;
          this.appHeaderService.setAppHeader('Recipe | ' + this.recipe.name);
          this.likes = recipe.likes.length;
          this.dislikes = recipe.dislikes.length;
          this.saves = recipe.saves.length;
          this.initRecipeButtons();
        },
        (error) => {
          this.router.navigate(['/404']);
        });
    });

    this.userService.setAuthToken( this.token );

  }

  onLikeButtonClick(){

    if( this.isRecipeLiked ){
      return;
    }

    this.isRecipeLiked = true;
    this.isRecipeDisliked = false;

    this.sessionUser.liked_recipes.push( this.recipe.id );
    this.likes++;

    if( this.sessionUser.disliked_recipes.includes( this.recipe.id ) ){
      this.sessionUser.disliked_recipes = this.sessionUser.disliked_recipes.filter( elem => elem != this.recipe.id );
      this.dislikes--;
    }

    this.userService
      .updateUser( this.sessionUser.id ,
        {
          liked_recipes: this.sessionUser.liked_recipes,
          disliked_recipes: this.sessionUser.disliked_recipes
        }
      )
      .subscribe(
      (user) => {

      },
      (error) => {

      });
  }

  onDislikeButtonClick(){

    if( this.isRecipeDisliked ){
      return;
    }

    this.isRecipeLiked = false;
    this.isRecipeDisliked = true;

    this.sessionUser.disliked_recipes.push( this.recipe.id );
    this.dislikes++;

    if( this.sessionUser.liked_recipes.includes( this.recipe.id ) ){
      this.sessionUser.liked_recipes = this.sessionUser.liked_recipes.filter( elem => elem != this.recipe.id );
      this.likes--;
    }

    this.userService
      .updateUser( this.sessionUser.id ,
        {
          liked_recipes: this.sessionUser.liked_recipes,
          disliked_recipes: this.sessionUser.disliked_recipes
        }
       )
      .subscribe(
      (user) => {

      },
      (error) => {

      });
  }

  onSaveButtonClick(){
    if( this.isRecipeSaved == true ){
      this.isRecipeSaved = false;
      this.saves--;
      this.sessionUser.saved_recipes = this.sessionUser.saved_recipes.filter( elem => elem != this.recipe.id );
    }
    else{
      this.isRecipeSaved = true;
      this.saves++;
      this.sessionUser.saved_recipes.push( this.recipe.id );
    }

    this.userService
      .updateUser( this.sessionUser.id ,
        {
          saved_recipes: this.sessionUser.saved_recipes
        }
       )
      .subscribe(
      (user) => {

      },
      (error) => {

      });
  }

  initRecipeButtons(){
    if( this.sessionUser.liked_recipes.includes( this.recipe.id ) ){
      this.isRecipeLiked = true;
      this.isRecipeDisliked = false;
    }

    if( this.sessionUser.disliked_recipes.includes( this.recipe.id ) ){
      this.isRecipeLiked = false;
      this.isRecipeDisliked = true;
    }

    if( this.sessionUser.saved_recipes.includes( this.recipe.id ) ){
      this.isRecipeSaved = true;
    }
  }

}
