import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgbProgressbarModule, NgbTabsetModule } from '@ng-bootstrap/ng-bootstrap';

import { ProfileComponent } from './profile.component';
import { ProfileRoutes } from './profile.routing';

import { UserService } from '../services/user.service';

@NgModule({
  imports:
  [
    CommonModule,
    RouterModule.forChild(ProfileRoutes),
    NgbProgressbarModule,
    NgbTabsetModule
  ],
  declarations:
  [
    ProfileComponent
  ],
  providers:
  [
    UserService
  ]
})

export class ProfileModule {}
