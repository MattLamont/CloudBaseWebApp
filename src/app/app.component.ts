import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>'
})
export class AppComponent {
  constructor(translate: TranslateService,
              private localStorage: LocalStorageService ,
              private sessionStorage: SessionStorageService) {
    translate.addLangs(['en', 'fr']);
    translate.setDefaultLang('en');

    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');

    let user = this.localStorage.retrieve( 'user' );
    let token = this.localStorage.retrieve( 'token' );

    if( user && token ){
      this.sessionStorage.store( 'user' , user );
      this.sessionStorage.store( 'token' , token );
    }
  }
}
