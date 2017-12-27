import { Component } from '@angular/core';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { AppHeaderService } from '../services/appheader.service';
import { ActivatedRoute, Router } from '@angular/router';


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
  public isRecipeSaved = false;

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
        .findOneRecipe(recipeId, ['flavors', 'owner'])
        .subscribe(
        (recipe) => {
          this.recipe = recipe;
          this.appHeaderService.setAppHeader('Recipe | ' + this.recipe.name);
          this.initRecipeButtons();
        },
        (error) => {
          this.router.navigate(['/404']);
        });
    });

    if (this.sessionUser) {
      this.userService.setAuthToken(this.token);
    }
  }

  onLikeButtonClick() {

    if (!this.sessionUser) {
      return;
    }

    if (this.isRecipeLiked) {
      this.isRecipeLiked = false;
      this.recipe.likes_count--;

      this.userService
        .removeRecipeLike(this.sessionUser.id, this.recipe.id)
        .subscribe(
        (like) => {

        },
        (error) => {

        });
    }
    else{
      this.isRecipeLiked = true;
      this.recipe.likes_count++;

      this.userService
        .addRecipeLike(this.sessionUser.id, this.recipe.id)
        .subscribe(
        (user) => {

        },
        (error) => {

        });
    }
  }


  onSaveButtonClick() {
    if (!this.sessionUser) {
      return;
    }

    if (this.isRecipeSaved == true) {
      this.isRecipeSaved = false;
      this.recipe.saves_count--;

      this.userService
        .removeRecipeSave(this.sessionUser.id, this.recipe.id)
        .subscribe(
        (save) => {

        },
        (error) => {

        });
    }
    else {
      this.isRecipeSaved = true;
      this.recipe.saves_count++;
      this.userService
        .addRecipeSave(this.sessionUser.id, this.recipe.id)
        .subscribe(
        (save) => {

        },
        (error) => {

        });
    }
  }

  initRecipeButtons() {
    if (!this.sessionUser) {
      return;
    }

    this.userService
      .findOneRecipeLike(this.sessionUser.id, this.recipe.id)
      .subscribe(
      (likes) => {
        if( likes[0] ){
          this.isRecipeLiked = true;
        }
      },
      (error) => {

      });

    this.userService
      .findOneRecipeSave(this.sessionUser.id, this.recipe.id)
      .subscribe(
      (saves) => {
        if( saves[0] ){
          this.isRecipeSaved = true;
        }
      },
      (error) => {

      });
  }

}
