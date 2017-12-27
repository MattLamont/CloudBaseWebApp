import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { FormsModule } from '@angular/forms';
import { SidebarModule } from 'ng-sidebar';

import { recipeComponent } from './recipe.component';
import { recipeRoutes } from './recipe.routing';

import { RecipeService } from '../services/recipe.service';
import { UserService } from '../services/user.service';
import { MailService } from './email.service';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(recipeRoutes),
    NgbProgressbarModule, NgbTabsetModule,
    NgbModule,
    NgxChartsModule,
    FormsModule,
    SidebarModule
  ],
  declarations: [
    recipeComponent
  ],
  providers: [
    RecipeService,
    UserService,
    MailService
  ]
})

export class RecipeModule { }
