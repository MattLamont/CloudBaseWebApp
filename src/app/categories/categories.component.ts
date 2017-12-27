import { Component } from '@angular/core';
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

  view_type = 'cards';

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

    this.route.params.subscribe(params => {
      let categoriesId = params['id'];
      this.recipeService
        .findRecipes( ['owner'] , 'category=' + this.category )
        .subscribe(
        (recipes) => {
          this.recipes = recipes;
        },
        (error) => {
          this.router.navigate(['/404']);
        });
    });

  }

}
