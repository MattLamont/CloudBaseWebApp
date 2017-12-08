import { Component } from '@angular/core';
import * as Quill from 'quill';
import { environment } from 'environments/environment';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { FlavorService } from '../services/flavor.service';
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

  public imageUploadURL = environment.cloudBaseApiURL + '/upload?type=user';
  public authHeaders = { Authorization: '' };

  @LocalStorage('user')
  localUser;

  @SessionStorage('user')
  sessionUser;

  @SessionStorage('token')
  token

  public newImageURL = '';

  public alertMessage = '';
  public alertType = 'success';

  searchFailed = false;

  public chartData = [
    {
      name: 'Nicotine',
      value: 10
    },
    {
      name: 'PG',
      value: 30
    },
    {
      name: 'VG',
      value: 30
    },
    {
      name: 'Dilutant',
      value: 10
    },
    {
      name: 'Flavors',
      value: 10
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

  public recipe = {
    totalVolume: 10,
    recipeStrength: 3,
    pg: 30,
    vg: 70,
    nicotineStrength: 100,
    nicotinePG: 100,
    nicotineVG: 0,
    flavors: [
      {
        name: '',
        manufacturer: 'Flavor',
        id: null,
        percent: 0,
        model: null
      },
    ],
    category: '',
    steepTime: 0
  };

  constructor(
    private flavorService: FlavorService
  ) {}

  ngOnInit() {
    this.quill = new Quill('#editor-container', {
      modules: {
        toolbar: {
          container: '#toolbar-toolbar'
        }
      },
      placeholder: 'Write something about yourself...',
      theme: 'snow'
    });

    this.authHeaders.Authorization = 'Bearer ' + this.token;
    //this.quill.container.firstChild.innerHTML = this.sessionUser.biography;
  }

  imageUploaded(event) {
    let res = JSON.parse(event.serverResponse._body);
    this.newImageURL = res.url;
  }

  submitUserCreateRecipe() {

    this.sessionUser.biography = this.quill.container.firstChild.innerHTML;

    if (this.newImageURL) {
      this.sessionUser.image_url = this.newImageURL;
    }
  }

  addAnotherFlavor(){
    this.recipe.flavors.push(
      {
        name: '',
        manufacturer: 'Flavor',
        id: null,
        percent: 0,
        model: null
      });
      console.log( this.recipe.flavors );
      console.log( this.recipe );
  }

  flavorSelected( event , index ){
    this.recipe.flavors[index] = { ...this.recipe.flavors[index] , ...event.item };
    console.log( this.recipe.flavors );
  }

  onNicotinePGChange(){
    this.recipe.nicotineVG = 100 - this.recipe.nicotinePG;
  }

  onNicotineVGChange(){
    this.recipe.nicotinePG = 100 - this.recipe.nicotineVG;
  }

  searchFlavor = (text$: Observable<string>) =>
    text$
      .debounceTime(300)
      .distinctUntilChanged()
      .switchMap( term =>
        this.flavorService.searchForFlavor(term)
          .do((data) => this.searchFailed = false)
          .catch(() => {
            this.searchFailed = true;
            return Observable.of([]);
          }))

    formatter = (x: {name: string}) => x.name;
}
