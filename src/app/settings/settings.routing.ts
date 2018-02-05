import { Routes } from '@angular/router';

import { SettingsComponent } from './settings.component';

export const SettingsRoutes: Routes = [{
  path: '',
  component: SettingsComponent,
  data: {
    heading: 'Settings'
  }
}];
