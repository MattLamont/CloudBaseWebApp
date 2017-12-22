import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';

import { RecipeCardComponent } from './recipe_card/recipe_card.component';
import { UserCardComponent } from './user-card/user-card.component';
import { RecipeContainerComponent } from './recipe-container/recipe-container.component';

@NgModule({
  imports:
  [
    RouterModule,
    CommonModule
  ],
  declarations:
  [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    RecipeCardComponent,
    UserCardComponent,
    RecipeContainerComponent
  ],
  exports:
  [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    RecipeCardComponent,
    UserCardComponent,
    RecipeContainerComponent
  ],
  providers:
  [
    MenuItems
  ]
})
export class SharedModule { }
