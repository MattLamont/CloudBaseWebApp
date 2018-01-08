import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { SessionStorage, LocalStorage } from 'ngx-webstorage';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {

  @LocalStorage('user')
  localUser;

  @SessionStorage('user')
  sessionUser;

  @SessionStorage('token')
  token;


  constructor(translate: TranslateService,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService,
    private userService: UserService
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    let currentTime = Math.round((new Date()).getTime() / 1000);

    let user = this.localUser;
    if( !user ) user = this.sessionUser;

    if (user && this.token) {

      this.authService
        .validateToken(this.token)
        .subscribe(
        (res) => {

          if (res.success) {

            //if the token still has more than a day to expire, then keep the token
            if ((res.user.exp - currentTime) > 86400) {
              this.sessionUser = user;
              this.getUserProfile();
            }
            else {
              this.sessionStorage.clear('user');
              this.sessionStorage.clear('token');
              this.localStorage.clear('user');
              this.localStorage.clear('token');
            }

          }
          else {
            this.sessionStorage.clear('user');
            this.sessionStorage.clear('token');
            this.localStorage.clear('user');
            this.localStorage.clear('token');
          }
        },
        (error) => {

        });
    }


  }

  getUserProfile(){
    this.userService
      .findOneUser( this.sessionUser.id , '' , ['following'])
      .subscribe(
      (user) => {
        this.localUser = user;
        this.sessionUser = user;
      },
      (error) => {

      });
  }
}
