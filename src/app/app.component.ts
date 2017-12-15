import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(translate: TranslateService,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private authService: AuthService
  ) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    let currentTime = Math.round((new Date()).getTime() / 1000);

    let user = this.localStorage.retrieve('user');
    if( !user ) user = this.sessionStorage.retrieve('user');

    let token = this.localStorage.retrieve('token');
    if( !token ) token = this.sessionStorage.retrieve('token');

    if (user && token) {

      this.authService
        .validateToken(token)
        .subscribe(
        (res) => {

          if (res.success) {

            //if the token still has more than a day to expire, then keep the token
            if ((res.user.exp - currentTime) > 86400) {
              this.sessionStorage.store('user', user);
              this.sessionStorage.store('token', token);
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
}
