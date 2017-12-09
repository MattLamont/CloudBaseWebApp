import { Component, NgZone  } from '@angular/core';
import * as Quill from 'quill';
import { environment } from 'environments/environment';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { FlavorService } from '../services/flavor.service';
import { RecipeService } from '../services/recipe.service';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { Observable } from 'rxjs/Observable';
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

  public newImageURL = '';

  public recipeBaseErrorMessage = '';
  public flavorErrorMessage = '';
  public submitErrorMessage = '';
  public submitErrorMessageType = 'danger';

  searchFailed = false;

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

  public mixingChart = {
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
    flavors: [
      {
        percent: 0,
        ml: 0,
        grams: 0,
      }
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

  public recipe = {
    name: '',
    totalVolume: 100,
    recipeStrength: 10,
    pg: 50,
    vg: 50,
    nicotineStrength: 100,
    nicotinePG: 50,
    nicotineVG: 50,
    flavors: [
      {
        name: '',
        manufacturer: 'Flavor',
        id: null,
        percent: 0,
        model: null
      },
    ],
    category: 'Other',
    steepTime: 0
  };

  constructor(
    private flavorService: FlavorService,
    private recipeService: RecipeService,
    private zone: NgZone
  ) { }

  ngOnInit() {
    this.quill = new Quill('#editor-container', {
      modules: {
        toolbar: {
          container: '#toolbar-toolbar'
        }
      },
      placeholder: 'Write about your recipe here...',
      theme: 'snow'
    });

    this.authHeaders.Authorization = 'Bearer ' + this.token;
    this.recipeService.setAuthToken( this.token );

    this.recalculateRecipe();
  }

  imageUploaded(event) {
    let res = JSON.parse(event.serverResponse._body);
    this.newImageURL = res.url;
  }

  onImageRemoved() {
    this.newImageURL = '';
  }

  recalculateRecipe() {

    //variables to keep track of the pg and vg content as we calculate the recipe
    let vgMlCount = 0;
    let pgMlCount = 0;

    //variable to keep track of how much volume is left in bottle
    let volumeLeft = this.recipe.totalVolume;

    //find amount of nicotine in mg
    let amountOfNicotine = this.recipe.recipeStrength * this.recipe.totalVolume;

    //find the amount of diluted nicotine to use
    if (this.recipe.nicotineStrength != 0) {
      this.mixingChart.nicotine.ml = amountOfNicotine / this.recipe.nicotineStrength;
      this.mixingChart.nicotine.percent = (this.mixingChart.nicotine.ml / this.recipe.totalVolume) * 100;
      volumeLeft = volumeLeft - this.mixingChart.nicotine.ml;
    }

    //find the amount of pg and vg that was added from the nicotine Solution
    if (this.recipe.nicotineVG != 0) {
      vgMlCount = vgMlCount + (this.mixingChart.nicotine.ml * (this.recipe.nicotineVG / 100));
    }

    if (this.recipe.nicotinePG != 0) {
      pgMlCount = pgMlCount + (this.mixingChart.nicotine.ml * (this.recipe.nicotinePG / 100));
    }

    //find the amount of each flavor to use
    this.mixingChart.flavors.forEach((flavor, i) => {

      flavor.percent = this.recipe.flavors[i].percent;
      if (flavor.percent == 0) return;

      flavor.ml = (flavor.percent / 100) * this.recipe.totalVolume;
      volumeLeft = volumeLeft - flavor.ml;
      pgMlCount = pgMlCount + flavor.ml;
      this.mixingChart.flavors[i] = flavor;
    });

    let baseVolume = pgMlCount + vgMlCount + volumeLeft;

    let pgToAdd = 0;
    let vgToAdd = 0;

    if (this.recipe.pg != 0) {
      pgToAdd = (baseVolume * (this.recipe.pg / 100)) - pgMlCount;
    }
    else {
      pgToAdd = 0;
    }

    if (this.recipe.vg != 0) {
      vgToAdd = (baseVolume * (this.recipe.vg / 100)) - vgMlCount;
    }
    else {
      vgToAdd = 0;
    }

    this.mixingChart.pg.ml = pgToAdd;
    this.mixingChart.vg.ml = vgToAdd;

    this.mixingChart.pg.percent = (pgToAdd / this.recipe.totalVolume) * 100;
    this.mixingChart.vg.percent = (vgToAdd / this.recipe.totalVolume) * 100;

    if ((((pgMlCount + pgToAdd) / this.recipe.totalVolume) * 100) > this.recipe.pg) {
      this.recipeBaseErrorMessage = "Error: PG/VG ratio invalid";
      return;
    }

    if ((((vgMlCount + vgToAdd) / this.recipe.totalVolume) * 100) > this.recipe.vg) {
      this.recipeBaseErrorMessage = "Error: PG/VG ratio invalid";
      return;
    }

    if (this.mixingChart.nicotine.ml > this.recipe.totalVolume) {
      this.recipeBaseErrorMessage = "Error: Nicotine ratio invalid";
      return;
    }

    this.recipeBaseErrorMessage = '';
    this.flavorErrorMessage = '';

    this.chartData[0].value = this.mixingChart.nicotine.percent;
    this.chartData[1].value = this.mixingChart.pg.percent;
    this.chartData[2].value = this.mixingChart.vg.percent;
    this.chartData[3].value = 100 - (this.mixingChart.nicotine.percent + this.mixingChart.pg.percent + this.mixingChart.vg.percent);
    this.chartData = [...this.chartData];
  }

  addAnotherFlavor() {
    this.recipe.flavors.push(
      {
        name: '',
        manufacturer: 'Flavor',
        id: null,
        percent: 0,
        model: null
      });

    this.mixingChart.flavors.push(
      {
        percent: 0,
        ml: 0,
        grams: 0
      }
    );

    this.recalculateRecipe();
  }

  flavorSelected(event, index) {
    this.recipe.flavors[index] = { ...this.recipe.flavors[index], ...event.item };
    this.recalculateRecipe();
  }

  onNicotinePGChange() {
    if (this.recipe.nicotinePG > 100 || this.recipe.nicotinePG < 0) {
      this.recipeBaseErrorMessage = 'Error: Nicotine PG must be 0-100';
      return;
    }
    this.recipe.nicotineVG = 100 - this.recipe.nicotinePG;
    this.recalculateRecipe();
  }

  onNicotineVGChange() {
    if (this.recipe.nicotineVG > 100 || this.recipe.nicotineVG < 0) {
      this.recipeBaseErrorMessage = 'Error: Nicotine VG must be 0-100';
      return;
    }
    this.recipe.nicotinePG = 100 - this.recipe.nicotineVG;
    this.recalculateRecipe();
  }

  onRecipePGChange(event) {
    if (this.recipe.pg > 100 || this.recipe.pg < 0) {
      this.recipeBaseErrorMessage = 'Error: PG must be 0-100';
      return;
    }
    this.recipe.vg = 100 - this.recipe.pg;
    this.recalculateRecipe();
  }

  onRecipeVGChange(event) {
    if (this.recipe.vg > 100 || this.recipe.vg < 0) {
      this.recipeBaseErrorMessage = 'Error: VG must be 0-100';
      return;
    }
    this.recipe.pg = 100 - this.recipe.vg;
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

  submitNewRecipe() {

    let newRecipe = {
      name: '',
      flavors: [],
      pg_percent: 0,
      vg_percent: 0,
      flavor_percents: [],
      dilutant: 0,
      steep_time: 0,
      description: '',
      image_url: '',
      category: ''
    };

    this.submitErrorMessage = '';

    //validate and add in recipe Name
    if( this.recipe.name.length > 2 ){
      newRecipe.name = this.recipe.name;
    }
    else{
      this.submitErrorMessageType = 'danger';
      this.submitErrorMessage = 'Name must be more than 2 characters long.';
      return;
    }

    //validate and add in the recipe vg
    if( this.recipe.pg != null ){
      newRecipe.pg_percent = this.recipe.pg;
    }

    //validated and add in the recipe pg
    if( this.recipe.vg != null ){
      newRecipe.vg_percent = this.recipe.vg;
    }

    //add in each of the flavor id's and percents. Also validate for non-null values
    this.recipe.flavors.forEach((flavor, i) => {

      if( !flavor.name ){
        return;
      }

      if( !flavor.percent || flavor.percent == 0 ){
        return;
      }

      newRecipe.flavors.push( flavor.id );
      newRecipe.flavor_percents.push( flavor.percent );
    });

    //add in the steep time
    newRecipe.steep_time = this.recipe.steepTime;

    //Validate recipe description
    if( this.quill.getLength() > 1 ){
      newRecipe.description = this.quill.container.firstChild.innerHTML;
    }
    else{
      newRecipe.description = '';
    }

    //add in the image url for the recipe
    newRecipe.image_url = this.newImageURL;

    //add in the Category
    newRecipe.category = this.recipe.category;

    //add the the recipe to database
    this.recipeService
      .createRecipe(newRecipe)
      .subscribe(
      (recipe) => {
        console.log( recipe );
        this.submitErrorMessageType = 'success';
        this.submitErrorMessage = "Recipe Created!"
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
