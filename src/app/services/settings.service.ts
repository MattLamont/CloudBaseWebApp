import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class SettingsService {
    private subject = new Subject<SettingsModel>();

    setSettings(settings: SettingsModel) {
        this.subject.next(settings);
    }

    getSettings(): Observable<SettingsModel> {
        return this.subject.asObservable();
    }
}

export class SettingsModel {

  constructor() {

  }

  public themeType = {
    light: 'light',
    dark: 'dark'
  };

  public sidebarType = {
    push: 'push',
    dock: 'dock',
    over: 'over',
    slide: 'slide'
  };

  public theme = 'light';
  public sidebar = 'push';
  public recipe_display = 'cards';
}
