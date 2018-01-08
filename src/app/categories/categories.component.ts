import { HostListener, Component , AfterViewInit } from '@angular/core';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { AppHeaderService } from '../services/appheader.service';
import { ActivatedRoute , Router } from '@angular/router';


@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent {

  @LocalStorage('user')
  localUser;

  @SessionStorage('user')
  sessionUser;

  @SessionStorage('token')
  token;

  category: string;
  recipes: any;
  numRecipesShown = 0;

  view_type = 'cards';
  showLoadMoreButton = true;
  showLoadingSpinner = false;

  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private appHeaderService: AppHeaderService,
    private userService: UserService
  ) { }


  ngOnInit() {

    if( this.route.snapshot.data.heading ){
      this.category = this.route.snapshot.data.heading
    }
    else{
      this.router.navigate(['404']);
    }

    this.appHeaderService.setAppHeader('Category | ' + this.category );

    if( this.sessionUser ){
      this.view_type = this.sessionUser.settings.recipe_display;
    }

    this.getMoreRecipes();

  }

  getMoreRecipes(){
    this.showLoadingSpinner = true;

    this.recipeService
      .findRecipes( ['owner'] , `category=${this.category}&limit=30&skip=${this.numRecipesShown}` )
      .subscribe(
      (recipes) => {
        if( !this.recipes ) this.recipes = recipes;
        else this.recipes = this.recipes.concat( recipes );

        if( recipes.length != 30 ){
            this.showLoadMoreButton = false;
        }
        this.numRecipesShown = this.recipes.length;
        this.showLoadingSpinner = false;
      },
      (error) => {
        this.router.navigate(['/404']);
      });
  }

}
