import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';

import { NgxChartsModule } from '@swimlane/ngx-charts';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutes } from './dashboard.routing';

import { RecipeService } from '../services/recipe.service';


@NgModule({
  imports:
  [
    CommonModule,
    RouterModule.forChild(DashboardRoutes),
    NgxChartsModule,
    SharedModule
  ],
  declarations: [
    DashboardComponent
  ],
  providers: [
    RecipeService
  ]
})

export class DashboardModule {}
