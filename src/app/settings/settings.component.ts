import { Component } from '@angular/core';
import * as Quill from 'quill';
import { environment } from 'environments/environment';
import { SessionStorage , LocalStorage } from 'ngx-webstorage';
import { UserService } from '../services/user.service';
import { SettingsService , SettingsModel } from '../services/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {

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
  public alertType = 'success'

  public quill: any;

  public theme = 'light';
  public sidebarMode = 'push';

  public settings = new SettingsModel();

  constructor(
    private userService: UserService,
    private settingsService: SettingsService
  ) {

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

    this.settings = this.sessionUser.settings;
  }

  imageUploaded(event) {
    let res = JSON.parse(event.serverResponse._body);
    this.newImageURL = res.url;
  }

  submitUserSettings() {

    this.settingsService.setSettings(this.settings);

    this.sessionUser.biography = this.quill.container.firstChild.innerHTML;

    if( this.newImageURL ){
      this.sessionUser.image_url = this.newImageURL;
    }

    this.sessionUser.settings = this.settings;

    this.userService
      .updateUser(this.sessionUser.id ,
          {
            biography: this.sessionUser.biography,
            image_url: this.sessionUser.image_url,
            settings: this.sessionUser.settings
          }
        )
      .subscribe(
      (newUser) => {

        this.alertType = 'success';
        this.alertMessage = "Settings updated!"
      },
      (error) => {
        this.alertType = 'danger';
        this.alertMessage = error.message;
      });
  }
}
