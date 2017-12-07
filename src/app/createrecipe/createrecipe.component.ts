import { Component } from '@angular/core';
import * as Quill from 'quill';
import { environment } from 'environments/environment';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { FlavorService } from '../services/flavor.service';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { single } from '../shared/chartData';
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

  public recipe = {
    name: '',
    flavors: {},
    pg_percent: 30,
    vg_percent: 70,
    flavor_percents: [],
    dilutant: 0,
    steep_time: 0,
    description: '',
    tags: [],
    image_url: '',
    category: '',
  };

  public selectedFlavors = [
    {

    }
  ];

  searching = false;
  searchFailed = false;

  single: any[];

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
  selectedCategory = null;


  constructor(
    private flavorService: FlavorService
  ) {
    Object.assign(this, {
      single
    });
  }

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
    this.quill.container.firstChild.innerHTML = this.sessionUser.biography;
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

    print(){
      console.log( this.recipe.flavors );
    }
}
