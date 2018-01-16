import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpModule } from '@angular/http';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarModule } from 'ng-sidebar';

import { AppRoutes } from './app.routing';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin/admin-layout.component';
import { AuthLayoutComponent } from './layouts/auth/auth-layout.component';
import { SharedModule } from './shared/shared.module';

import { Ng2Webstorage } from 'ngx-webstorage';

import { AppHeaderService } from './services/appheader.service';
import { AuthService } from './services/auth.service';
import { UserService } from './services/user.service';
import { RecipeService } from './services/recipe.service';
import { SettingsService } from './services/settings.service';
import { FlavorService } from './services/flavor.service';


@NgModule({
  declarations: [
    AppComponent,
    AdminLayoutComponent,
    AuthLayoutComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SharedModule,
    RouterModule.forRoot(AppRoutes),
    FormsModule,
    HttpClientModule,
    HttpModule,
    NgbModule.forRoot(),
    SidebarModule.forRoot(),
    Ng2Webstorage,
  ],
  providers: [
    AppHeaderService,
    AuthService,
    UserService,
    RecipeService,
    SettingsService,
    FlavorService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
