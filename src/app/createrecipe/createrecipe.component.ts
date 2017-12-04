import { Component } from '@angular/core';
import * as Quill from 'quill';
import { environment } from 'environments/environment';
import { SessionStorage , LocalStorage } from 'ngx-webstorage';
import { UserService } from '../services/user.service';
import { colorSets } from '@swimlane/ngx-charts/release/utils/color-sets';
import { single } from '../shared/chartData';

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

  @SessionStorage( 'user' )
  sessionUser;

  @SessionStorage('token')
  token

  public newImageURL = '';

  public alertMessage = '';
  public alertType = 'success';

  single: any[];
  // options
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = false;
  showXAxisLabel = true;
  tooltipDisabled = true;
  xAxisLabel = 'Country';
  showYAxisLabel = true;
  yAxisLabel = 'GDP Per Capita';
  showGridLines = true;
  innerPadding = 0;
  barPadding = 8;
  groupPadding = 16;
  roundDomains = false;
  maxRadius = 10;
  minRadius = 3;

  colorScheme = {
    domain: [
      '#0099cc', '#2ECC71', '#4cc3d9', '#ffc65d', '#d96557', '#ba68c8'
    ]
  };
  schemeType = 'ordinal';

  // pie
  showLabels = true;
  explodeSlices = false;
  doughnut = false;
  arcWidth = 0.25;


  public quill: any;

  constructor(
    private userService: UserService
  ) {
    Object.assign(this, {
      single
    });
    console.log( this.single );
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
    this.userService.setAuthToken( this.token );
    this.quill.container.firstChild.innerHTML = this.sessionUser.biography;
  }

  imageUploaded(event) {
    let res = JSON.parse(event.serverResponse._body);
    this.newImageURL = res.url;
  }

  submitUserCreateRecipe() {

    this.sessionUser.biography = this.quill.container.firstChild.innerHTML;

    if( this.newImageURL ){
      this.sessionUser.image_url = this.newImageURL;
    }

    this.userService
      .updateUser(this.sessionUser)
      .subscribe(
      (newUser) => {
        this.sessionUser = newUser[0];

        if( this.localUser ){
          this.localUser = this.sessionUser;
        }
        this.alertType = 'success';
        this.alertMessage = "CreateRecipe updated!"
      },
      (error) => {
        this.alertType = 'danger';
        this.alertMessage = error.message;
      });
  }


  select(data) {
    console.log('Item clicked', data);
  }

  onLegendLabelClick(entry) {
    console.log('Legend clicked', entry);
  }
}
