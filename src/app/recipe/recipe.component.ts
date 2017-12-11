import { Component } from '@angular/core';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { RecipeService } from '../services/recipe.service';
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


  constructor(
    private recipeService: RecipeService,
    private route: ActivatedRoute,
    private router: Router,
    private appHeaderService: AppHeaderService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      let recipeId = params['id'];
      this.recipeService
        .findOneRecipe(recipeId)
        .subscribe(
        (recipe) => {
          this.recipe = recipe;
          this.appHeaderService.setAppHeader('Recipe | ' + this.recipe.name);
        },
        (error) => {
          this.router.navigate(['/404']);
        });
    });
  }

}
