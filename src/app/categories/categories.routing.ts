import { Routes } from '@angular/router';

import { CategoriesComponent } from './categories.component';

export const CategoriesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'tobacco',
        component: CategoriesComponent,
        data:
        {
          heading: 'Tobacco'
        }
      },
      {
        path: 'dessert',
        component: CategoriesComponent,
        data:
        {
          heading: 'Dessert'
        }
      },
      {
        path: 'fruit',
        component: CategoriesComponent,
        data:
        {
          heading: 'Fruit'
        }
      },
      {
        path: 'candy',
        component: CategoriesComponent,
        data:
        {
          heading: 'Candy'
        }
      },
      {
        path: 'food',
        component: CategoriesComponent,
        data:
        {
          heading: 'Food'
        }
      },
      {
        path: 'beverage',
        component: CategoriesComponent,
        data:
        {
          heading: 'Beverage'
        }
      },
      {
        path: 'other',
        component: CategoriesComponent,
        data:
        {
          heading: 'Other'
        }
      }
    ]

  }];
