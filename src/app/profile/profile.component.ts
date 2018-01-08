import { Component , OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';

import { UserService } from '../services/user.service';
import { AppHeaderService } from '../services/appheader.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userId: Number;
  public user: any;

  public dataLoaded = false;

  recipesLoadButton = true;
  recipesLoadingSpinner = false;

  savedLoadButton = true;
  savedLoadingSpinner = false;

  likedLoadButton = true;
  likedLoadingSpinner = false;

  followersLoadButton = true;
  followersLoadingSpinner = false;

  followingLoadButton = true;
  followingLoadingSpinner = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService,
      private appHeaderService: AppHeaderService
    )
  {
  }


  ngOnInit(){
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.userService
        .findOneUser(this.userId , '' , ['recipes','liked_recipes','followers','following','saved_recipes'])
        .subscribe(
        (user) => {
          this.user = user;
          this.appHeaderService.setAppHeader('Profile | ' + this.user.username);
          this.dataLoaded = true;

          if( this.user.recipes == null || this.user.recipes.length < 30 ) this.recipesLoadButton = false;
          if( this.user.saved_recipes == null || this.user.saved_recipes.length < 30 ) this.savedLoadButton = false;
          if( this.user.liked_recipes == null || this.user.liked_recipes.length < 30 ) this.likedLoadButton = false;
          if( this.user.followers == null || this.user.followers.length < 30 ) this.followersLoadButton = false;
          if( this.user.following == null || this.user.following.length < 30 ) this.followingLoadButton = false;
        },
        (error) => {
          this.router.navigate(['/404']);
        });
    });
  }

  getUserRecipes(){

    this.recipesLoadingSpinner = true;

    let numRecipes = 0;
    if( this.user.recipes ){
      numRecipes = this.user.recipes.length;
    }

    this.userService
      .findOneUser( this.userId , '/recipes' , [] , `limit=30&skip=${numRecipes}` )
      .subscribe(
      (recipes) => {
        if( !this.user.recipes ) this.user.recipes = recipes;
        else this.user.recipes = this.user.recipes.concat( recipes );

        if( recipes.length != 30 ){
            this.recipesLoadButton = false;
        }
        this.recipesLoadingSpinner = false;
      },
      (error) => {
        this.recipesLoadButton = false;
      });
  }

  getSavedRecipes(){
    this.savedLoadingSpinner = true;

    let numRecipes = 0;
    if( this.user.saved_recipes ){
      numRecipes = this.user.saved_recipes.length;
    }

    this.userService
      .findOneUser( this.userId , '/saved_recipes' , [] , `limit=30&skip=${numRecipes}` )
      .subscribe(
      (recipes) => {
        if( !this.user.saved_recipes ) this.user.saved_recipes = recipes;
        else this.user.saved_recipes = this.user.saved_recipes.concat( recipes );

        if( recipes.length != 30 ){
            this.savedLoadButton = false;
        }
        this.savedLoadingSpinner = false;
      },
      (error) => {
        this.savedLoadButton = false;
      });
  }

  getLikedRecipes(){
    this.likedLoadingSpinner = true;

    let numRecipes = 0;
    if( this.user.liked_recipes ){
      numRecipes = this.user.liked_recipes.length;
    }

    this.userService
      .findOneUser( this.userId , '/liked_recipes' , [] , `limit=30&skip=${numRecipes}` )
      .subscribe(
      (recipes) => {
        if( !this.user.liked_recipes ) this.user.liked_recipes = recipes;
        else this.user.liked_recipes = this.user.liked_recipes.concat( recipes );

        if( recipes.length != 30 ){
            this.likedLoadButton = false;
        }
        this.likedLoadingSpinner = false;
      },
      (error) => {
        this.likedLoadButton = false;
      });
  }

  getFollowers(){
    this.followersLoadingSpinner = true;

    let numFollowers = 0;
    if( this.user.followers ){
      numFollowers = this.user.followers.length;
    }

    this.userService
      .findOneUser( this.userId , '/followers' , [] , `limit=30&skip=${numFollowers}` )
      .subscribe(
      (followers) => {
        if( !this.user.followers ) this.user.followers = followers;
        else this.user.followers = this.user.followers.concat( followers );

        if( followers.length != 30 ){
            this.followersLoadButton = false;
        }
        this.followersLoadingSpinner = false;
      },
      (error) => {
        this.followersLoadButton = false;
      });
  }

  getFollowing(){
    this.followingLoadingSpinner = true;

    let numFollowing = 0;
    if( this.user.following ){
      numFollowing = this.user.following.length;
    }

    this.userService
      .findOneUser( this.userId , '/following' , [] , `limit=30&skip=${numFollowing}` )
      .subscribe(
      (following) => {
        if( !this.user.following ) this.user.following = following;
        else this.user.following = this.user.following.concat( following );

        if( following.length != 30 ){
            this.followingLoadButton = false;
        }
        this.followingLoadingSpinner = false;
      },
      (error) => {
        this.followingLoadButton = false;
      });
  }
}
