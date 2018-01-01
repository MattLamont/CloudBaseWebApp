import { Component , OnInit, AfterContentInit } from '@angular/core';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { ReviewService } from '../services/review.service';
import { AppHeaderService } from '../services/appheader.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { Message } from './message';
import * as Quill from 'quill';

@Component({
  selector: 'app-recipe',
  templateUrl: './recipe.component.html',
  styleUrls: ['./recipe.component.scss']
})
export class recipeComponent implements OnInit {

  @LocalStorage('user')
  localUser;

  @SessionStorage('user')
  sessionUser;

  @SessionStorage('token')
  token;

  public recipe: any;

  public isRecipeLiked = false;
  public isRecipeSaved = false;

  isWritingReview = false;
  selectedReview: any;
  reviewPage = 1;
  pageStart = 0;
  pageEnd = 4;

  public form: FormGroup;
  public quill: any;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private appHeaderService: AppHeaderService,
    private userService: UserService,
    private reviewService: ReviewService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let recipeId = params['id'];
      this.recipeService
        .findOneRecipe(recipeId, ['flavors', 'owner', 'reviews'])
        .subscribe(
        (recipe) => {
          this.recipe = recipe;
          this.appHeaderService.setAppHeader('Recipe | ' + this.recipe.name);
          this.getRecipeReviews();
          this.initRecipeButtons();
        },
        (error) => {
          this.router.navigate(['/404']);
        });
    });

    if (this.sessionUser) {
      this.userService.setAuthToken(this.token);
      this.reviewService.setAuthToken( this.token );
    }

    this.form = this.formBuilder.group ( {
      title: [null , Validators.compose ( [ Validators.required ] )],
      rating: [null , Validators.compose ( [ Validators.required ] )]
    } );

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

  getRecipeReviews(): void{

    let queryParams = 'where={"recipe":' +  this.recipe.id + '}&sort=updatedAt%20DESC';

    this.reviewService
      .findReviews( ['owner'] , queryParams )
      .subscribe(
      (reviews) => {
        this.recipe.reviews = reviews;
        this.selectedReview = this.recipe.reviews[0];
      },
      (error) => {

      });

  }

  onReviewCreateClick(){

    this.isWritingReview = true;

    if( !this.quill ){

      this.quill = new Quill('#editor-container', {
        modules: {
          toolbar: {
            container: '#toolbar-toolbar'
          }
        },
        placeholder: 'Tell us what you thought of this recipe...',
        theme: 'snow'
      });

    }

  }

  onReviewSubmit(){

    this.reviewService
    .create(
      {
        title: this.form.value.title,
        rating: this.form.value.rating,
        description: this.quill.container.firstChild.innerHTML,
        recipe: [this.recipe.id]
      }
     )
     .subscribe(
       (review) => {
         review.owner = this.sessionUser;
         this.recipe.reviews.splice( 0 , 0 , review );
         this.selectedReview = this.recipe.reviews[0];
         this.isWritingReview = false;
         this.reviewPage = 1;
         this.onReviewPageChange(1);
       },
       (error) => {

       });
  }

  public get reviewsPage(){
    return this.recipe.reviews.slice( this.pageStart , this.pageEnd + 1 );
  }

  onReviewPageChange( event: any ){
    this.pageStart = (event - 1) * 5;
    this.pageEnd = this.pageStart + 4;
  }

}
