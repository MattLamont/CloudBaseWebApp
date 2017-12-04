import { Routes } from '@angular/router';

import { CreateRecipeComponent } from './createrecipe.component';

export const CreateRecipeRoutes: Routes = [{
  path: '',
  component: CreateRecipeComponent,
  data: {
    heading: 'Create Recipe'
  }
}];
