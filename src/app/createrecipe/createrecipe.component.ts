import { Component, NgZone  } from '@angular/core';
import * as Quill from 'quill';
import { environment } from 'environments/environment';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { FlavorService } from '../services/flavor.service';
import { RecipeService } from '../services/recipe.service';
import { AppHeaderService } from '../services/appheader.service';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute , Router } from '@angular/router';
import { Recipe } from '../models/recipe';
import { Flavor } from '../models/flavor';
import {NgbTypeahead} from "@ng-bootstrap/ng-bootstrap";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-createrecipe',
  templateUrl: './createrecipe.component.html',
  styleUrls: ['./createrecipe.component.scss']
})
export class CreateRecipeComponent {

  public imageUploadURL = environment.cloudBaseApiURL + '/upload?type=recipe';
  public authHeaders = { Authorization: '' };

  @LocalStorage('user')
  localUser;

  @SessionStorage('user')
  sessionUser;

  @SessionStorage('token')
  token

  public isUpdateRecipe = false;
  public isCreateRecipe = false;
  public isViewRecipe = false;

  public isLoaded = false;

  public newImageURL = '';

  public recipeBaseErrorMessage = '';
  public flavorErrorMessage = '';
  public submitErrorMessage = '';
  public submitErrorMessageType = 'danger';

  searchFailed = false;
  appHeader: string;

  public chartData = [
    {
      name: 'Nicotine',
      value: 10
    },
    {
      name: 'PG',
      value: 35
    },
    {
      name: 'VG',
      value: 45
    },
    {
      name: 'Flavors',
      value: 10
    },
    {
      name: 'Dilutant',
      value: 0
    }
  ];

  colorScheme = {
    domain: [
      '#0099cc', '#2ECC71', '#4cc3d9', '#ffc65d', '#d96557', '#ba68c8'
    ]
  };

  public quill: any;

  categories = [
    'Tobacco',
    'Dessert',
    'Fruit',
    'Candy',
    'Food',
    'Beverage',
    'Other'
  ];

  public basicMixingInfo = {
    totalVolume: 100,
    recipeStrength: 10,
    nicotineStrength: 100,
    nicotinePG: 50,
    nicotineVG: 50,
    nicotine: {
      percent: 0,
      ml: 0,
      grams: 0
    },
    vg: {
      percent: 0,
      ml: 0,
      grams: 0
    },
    pg: {
      percent: 0,
      ml: 0,
      grams: 0
    },
    flavors: []
  };

  public recipe: Recipe = null;

  public recipeId = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private flavorService: FlavorService,
    private recipeService: RecipeService,
    private appHeaderService: AppHeaderService
  )
  {
    this.recipe= new Recipe();

    this.route.params.subscribe(params => {

      this.recipeId = params['id'];

      if( this.router.url.startsWith('/create/recipe')){
        this.isCreateRecipe = true;
        this.appHeaderService.setAppHeader('Create Recipe');
        this.recipe = new Recipe();
        this.recalculateRecipe();
      }

      if( this.router.url.startsWith('/update/recipe')){
        this.isUpdateRecipe = true;
        this.appHeader = 'Update Recipe | ';
        this.getRecipeDetails( this.recipeId );
      }

      if( this.router.url.startsWith('/view/recipe')){
        this.isViewRecipe = true;
        this.appHeader = 'View Recipe | ';
        this.getRecipeDetails( this.recipeId );
      }

    });
  }

  ngOnInit() {

    let quillReadOnly = false;
    let quillPlaceholder = 'Write about your recipe here...';
    if( this.isViewRecipe ){
      quillReadOnly = true;
      quillPlaceholder = '';
    }

    this.quill = new Quill('#editor-container', {
      modules: {
        toolbar: {
          container: '#toolbar-toolbar'
        }
      },
      placeholder: quillPlaceholder,
      readOnly: quillReadOnly,
      theme: 'snow'
    });

    this.authHeaders.Authorization = 'Bearer ' + this.token;
    this.recipeService.setAuthToken( this.token );

    //this.recalculateRecipe();
  }

  imageUploaded(event) {
    let res = JSON.parse(event.serverResponse._body);
    this.recipe.image_url = res.url;
  }

  onImageRemoved() {
    this.recipe.image_url = '';
  }

  recalculateRecipe() {

    //clear the mixing table INFO
    this.basicMixingInfo.flavors = [];
    this.basicMixingInfo.nicotine = {
      percent: 0,
      ml: 0,
      grams: 0
    };
    this.basicMixingInfo.pg = {
      percent: 0,
      ml: 0,
      grams: 0
    };
    this.basicMixingInfo.vg = {
      percent: 0,
      ml: 0,
      grams: 0
    };

    //variables to keep track of the pg and vg content as we calculate the recipe
    let vgMlCount = 0;
    let pgMlCount = 0;

    //variable to keep track of how much volume is left in bottle
    let volumeLeft = this.basicMixingInfo.totalVolume;

    //find amount of nicotine in mg
    let amountOfNicotine = this.basicMixingInfo.recipeStrength * this.basicMixingInfo.totalVolume;

    //find the amount of diluted nicotine to use
    if (this.basicMixingInfo.nicotineStrength != 0) {
      this.basicMixingInfo.nicotine.ml = amountOfNicotine / this.basicMixingInfo.nicotineStrength;
      this.basicMixingInfo.nicotine.percent = (this.basicMixingInfo.nicotine.ml / this.basicMixingInfo.totalVolume) * 100;
      volumeLeft = volumeLeft - this.basicMixingInfo.nicotine.ml;
    }

    //find the amount of pg and vg that was added from the nicotine Solution
    if (this.basicMixingInfo.nicotineVG != 0) {
      vgMlCount = vgMlCount + (this.basicMixingInfo.nicotine.ml * (this.basicMixingInfo.nicotineVG / 100));
    }

    if (this.basicMixingInfo.nicotinePG != 0) {
      pgMlCount = pgMlCount + (this.basicMixingInfo.nicotine.ml * (this.basicMixingInfo.nicotinePG / 100));
    }

    //find the amount of each flavor to use
    this.recipe.flavor_percents.forEach((flavor_percent, i) => {

      let mixingFlavor = {
        percent: 0,
        ml: 0,
        grams: 0
      };

      if (flavor_percent == 0){
        this.basicMixingInfo.flavors.push( mixingFlavor );
        return;
      }

      mixingFlavor.percent = flavor_percent;
      mixingFlavor.ml = (flavor_percent / 100) * this.basicMixingInfo.totalVolume;
      volumeLeft = volumeLeft - mixingFlavor.ml;
      pgMlCount = pgMlCount + mixingFlavor.ml;
      this.basicMixingInfo.flavors.push( mixingFlavor );

    });

    let baseVolume = pgMlCount + vgMlCount + volumeLeft;

    let pgToAdd = 0;
    let vgToAdd = 0;

    if (this.recipe.pg_percent != 0) {
      pgToAdd = (baseVolume * (this.recipe.pg_percent / 100)) - pgMlCount;
    }
    else {
      pgToAdd = 0;
    }

    if (this.recipe.vg_percent != 0) {
      vgToAdd = (baseVolume * (this.recipe.vg_percent / 100)) - vgMlCount;
    }
    else {
      vgToAdd = 0;
    }

    this.basicMixingInfo.pg.ml = pgToAdd;
    this.basicMixingInfo.vg.ml = vgToAdd;

    this.basicMixingInfo.pg.percent = (pgToAdd / this.basicMixingInfo.totalVolume) * 100;
    this.basicMixingInfo.vg.percent = (vgToAdd / this.basicMixingInfo.totalVolume) * 100;

    if ((((pgMlCount + pgToAdd) / this.basicMixingInfo.totalVolume) * 100) > this.recipe.pg_percent) {
      this.recipeBaseErrorMessage = "Error: PG/VG ratio invalid";
      return;
    }

    if ((((vgMlCount + vgToAdd) / this.basicMixingInfo.totalVolume) * 100) > this.recipe.vg_percent) {
      this.recipeBaseErrorMessage = "Error: PG/VG ratio invalid";
      return;
    }

    if (this.basicMixingInfo.nicotine.ml > this.basicMixingInfo.totalVolume) {
      this.recipeBaseErrorMessage = "Error: Nicotine ratio invalid";
      return;
    }

    this.recipeBaseErrorMessage = '';
    this.flavorErrorMessage = '';

    this.chartData[0].value = this.basicMixingInfo.nicotine.percent;
    this.chartData[1].value = this.basicMixingInfo.pg.percent;
    this.chartData[2].value = this.basicMixingInfo.vg.percent;
    this.chartData[3].value = 100 - (this.basicMixingInfo.nicotine.percent + this.basicMixingInfo.pg.percent + this.basicMixingInfo.vg.percent);
    this.chartData = [...this.chartData];
  }

  addAnotherFlavor() {

    this.recipe.flavors.push( new Flavor() );

    this.recipe.flavor_percents.push( 0 );

    this.basicMixingInfo.flavors.push(
      {
      percent: 0,
      ml: 0,
      grams: 0
    });

    this.recalculateRecipe();
  }

  flavorSelected(event, index) {
    this.recipe.flavors[index] = event.item;
    this.recalculateRecipe();
  }

  onNicotinePGChange() {
    if (this.basicMixingInfo.nicotinePG > 100 || this.basicMixingInfo.nicotinePG < 0) {
      this.recipeBaseErrorMessage = 'Error: Nicotine PG must be 0-100';
      return;
    }
    this.basicMixingInfo.nicotineVG = 100 - this.basicMixingInfo.nicotinePG;
    this.recalculateRecipe();
  }

  onNicotineVGChange() {
    if (this.basicMixingInfo.nicotineVG > 100 || this.basicMixingInfo.nicotineVG < 0) {
      this.recipeBaseErrorMessage = 'Error: Nicotine VG must be 0-100';
      return;
    }
    this.basicMixingInfo.nicotinePG = 100 - this.basicMixingInfo.nicotineVG;
    this.recalculateRecipe();
  }

  onRecipePGChange(event) {
    if (this.recipe.pg_percent > 100 || this.recipe.pg_percent < 0) {
      this.recipeBaseErrorMessage = 'Error: PG must be 0-100';
      return;
    }
    this.recipe.vg_percent = 100 - this.recipe.pg_percent;
    this.recalculateRecipe();
  }

  onRecipeVGChange(event) {
    if (this.recipe.vg_percent > 100 || this.recipe.vg_percent < 0) {
      this.recipeBaseErrorMessage = 'Error: VG must be 0-100';
      return;
    }
    this.recipe.pg_percent = 100 - this.recipe.vg_percent;
    this.recalculateRecipe();
  }

  onFlavorPercentChange(event) {
    if (event == null) {
      return;
    }

    if (event > 100 || event < 0) {
      this.flavorErrorMessage = 'Error: Flavor percent must be 0-100';
      return;
    }
    this.recalculateRecipe();
  }

  getRecipeDetails( id: number ){

    if( id == null ){
      this.router.navigate(['/404']);
    }

    this.recipeService
      .findOneRecipe(id , ['flavors'])
      .subscribe(
      (recipe) => {

        this.recipe = recipe;
        this.appHeaderService.setAppHeader(this.appHeader + this.recipe.name);
        this.quill.container.firstChild.innerHTML = this.recipe.description;
        this.recalculateRecipe();
        this.isLoaded = true;
      },
      (error) => {
        this.router.navigate(['/404']);
      });
  }

  validateRecipe() : any {

    let newRecipe = new Recipe();

    this.submitErrorMessage = '';
    this.submitErrorMessageType = 'danger';

    //validate and add in recipe Name
    if( this.recipe.name.length < 2 ){
      this.submitErrorMessage = 'Name must be more than 2 characters long.';
      return;
    }
    newRecipe.name = this.recipe.name;

    //validate and add in the recipe vg
    if( this.recipe.pg_percent == null ){

      this.submitErrorMessage = 'Error: PG percent is invalid';
      return;
    }
    newRecipe.pg_percent = this.recipe.pg_percent;

    //validated and add in the recipe pg
    if( this.recipe.vg_percent == null ){
      this.submitErrorMessage = 'Error: PG percent is invalid';
      return;
    }
    newRecipe.vg_percent = this.recipe.vg_percent;

    //validate for non-null values and flavor names
    this.recipe.flavors.forEach((flavor, i) => {

      if( !flavor.name || this.recipe.flavor_percents[i] == 0 ){
        return
      }

      newRecipe.flavors.push( flavor.id );
      newRecipe.flavor_percents.push( this.recipe.flavor_percents[i] );
    });

    //Validate recipe description
    if( this.quill.getLength() > 1 ){
      newRecipe.description = this.quill.container.firstChild.innerHTML;
    }
    else{
      newRecipe.description = '';
    }

    newRecipe.steep_time = this.recipe.steep_time;
    newRecipe.image_url = this.recipe.image_url;
    newRecipe.category = this.recipe.category;
    delete newRecipe.owner;
    delete newRecipe.likes;
    delete newRecipe.dislikes;
    delete newRecipe.views;

    return newRecipe;
  }

  submitNewRecipe(){

    if( !this.sessionUser ){
      this.submitErrorMessageType = 'danger';
      this.submitErrorMessage = 'You must be logged in to create a recipe.';
      return;
    }

    let newRecipe = this.validateRecipe();

    //add the the recipe to database
    this.recipeService
      .createRecipe(newRecipe)
      .subscribe(
      (recipe) => {
        console.log( recipe );
        this.submitErrorMessageType = 'success';
        this.submitErrorMessage = "Recipe Created!"
        this.router.navigate(['/recipe/' + recipe.id]);
      },
      (error) => {
        this.submitErrorMessageType = 'danger';
        this.submitErrorMessage = error.message;
      });
  }

  updateRecipe(){

    if( !this.sessionUser ){
      this.submitErrorMessageType = 'danger';
      this.submitErrorMessage = 'You must be logged in to update a recipe.';
      return;
    }

    if( this.recipe.owner != this.sessionUser.id ){
      this.submitErrorMessageType = 'danger';
      this.submitErrorMessage = "Cannot update recipe. You do not own this recipe";
    }

    let newRecipe = this.validateRecipe();

    //update the the recipe to database
    this.recipeService
      .updateRecipe(newRecipe , this.recipeId )
      .subscribe(
      (recipe) => {
        console.log( recipe );
        this.submitErrorMessageType = 'success';
        this.submitErrorMessage = "Recipe Updated!"
        this.router.navigate(['/recipe/' + recipe.id]);
      },
      (error) => {
        this.submitErrorMessageType = 'danger';
        this.submitErrorMessage = error.message;
      });
  }

  searchFlavor = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap(term =>
        this.flavorService.searchForFlavor(term)
          .do((data) => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))

  formatter = (x: { name: string }) => x.name;
}
