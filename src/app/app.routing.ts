import { Routes } from '@angular/router';

import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';

export const AppRoutes: Routes = [{
  path: '',
  component: AdminLayoutComponent,
  children: [{
    path: '',
    loadChildren: './dashboard/dashboard.module#DashboardModule'
  }, {
    path: 'categories',
    loadChildren: './categories/categories.module#CategoriesModule'
  }, {
    path: 'settings',
    loadChildren: './settings/settings.module#SettingsModule'
  },{
    path: 'profile/:id',
    loadChildren: './profile/profile.module#ProfileModule'
  },{
    path: 'update/recipe/:id',
    loadChildren: './createrecipe/createrecipe.module#CreateRecipeModule'
  },{
    path: 'view/recipe/:id',
    loadChildren: './createrecipe/createrecipe.module#CreateRecipeModule'
  },{
    path: 'create/recipe',
    loadChildren: './createrecipe/createrecipe.module#CreateRecipeModule'
  },{
    path: 'recipe/:id',
    loadChildren: './recipe/recipe.module#RecipeModule'
  }]
}, {
  path: '',
  component: AuthLayoutComponent,
  children: [{
    path: 'authentication',
    loadChildren: './authentication/authentication.module#AuthenticationModule'
  }, {
    path: 'error',
    loadChildren: './error/error.module#ErrorModule'
  }]
}, {
  path: '**',
  redirectTo: 'error/404'
}];
