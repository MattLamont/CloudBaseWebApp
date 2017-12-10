import { Routes } from '@angular/router';

import { recipeComponent } from './recipe.component';

export const recipeRoutes: Routes = [{
  path: '',
  component: recipeComponent,
  data: {
    heading: 'Recipe'
  }
}];
