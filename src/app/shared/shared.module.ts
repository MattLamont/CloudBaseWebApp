import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MenuItems } from './menu-items/menu-items';
import { AccordionAnchorDirective, AccordionLinkDirective, AccordionDirective } from './accordion';
import { ToggleFullscreenDirective } from './fullscreen/toggle-fullscreen.directive';

import { RecipeCardComponent } from './recipe_card/recipe_card.component';
import { UserCardComponent } from './user-card/user-card.component';

@NgModule({
  imports:
  [
    RouterModule
  ],
  declarations:
  [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    RecipeCardComponent,
    UserCardComponent
  ],
  exports:
  [
    AccordionAnchorDirective,
    AccordionLinkDirective,
    AccordionDirective,
    ToggleFullscreenDirective,
    RecipeCardComponent,
    UserCardComponent
  ],
  providers:
  [
    MenuItems
  ]
})
export class SharedModule { }
