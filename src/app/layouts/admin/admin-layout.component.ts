import { Component, OnInit, OnDestroy, ViewChild, HostListener, AnimationTransitionEvent, NgZone, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import {LocalStorageService, LocalStorage , SessionStorageService , SessionStorage} from 'ngx-webstorage';
import { AppHeaderService } from '../../services/appheader.service';
import { RecipeService } from '../../services/recipe.service';
import { SettingsService } from '../../services/settings.service';
import { UserService } from '../../services/user.service';
import { FlavorService } from '../../services/flavor.service';

const SMALL_WIDTH_BREAKPOINT = 991;

export interface Options {
  heading?: string;
  removeFooter?: boolean;
  mapHeader?: boolean;
}

@Component({
  selector: 'app-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent implements OnInit, OnDestroy, AfterViewInit {

  private _router: Subscription;
  private mediaMatcher: MediaQueryList = matchMedia(`(max-width: ${SMALL_WIDTH_BREAKPOINT}px)`);

  @LocalStorage('user')
  localUser;

  @SessionStorage( 'user' )
  sessionUser;

  @SessionStorage('token')
  token;

  options: Options;
  theme = 'light';
  showSettings = false;
  isBoxed = false;
  isOpened = true;
  mode = 'push';
  _mode = this.mode;
  _autoCollapseWidth = 991;
  width = window.innerWidth;

  appHeaderSub: Subscription;
  settingsSub: Subscription;

  searchRecipeItems = [];
  searchUserItems = [];
  searchFlavorItems = [];

  categories = [
    {
      link: 'tobacco',
      name: 'Tobacco'
    },
    {
      link: 'dessert',
      name: 'Dessert'
    },
    {
      link: 'fruit',
      name: 'Fruit'
    },
    {
      link: 'candy',
      name: 'Candy'
    },
    {
      link: 'food',
      name: 'Food'
    },
    {
      link: 'beverage',
      name: 'Beverage'
    },
    {
      link: 'other',
      name: 'Other'
    }
  ];

  @ViewChild('sidebar') sidebar;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private modalService: NgbModal,
    private titleService: Title,
    private zone: NgZone,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private appHeaderService: AppHeaderService,
    private recipeService: RecipeService,
    private settingsService: SettingsService,
    private userService: UserService,
    private flavorService: FlavorService,
  ) {
    this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));

    // subscibe to the service that provides the header title for each page
    this.appHeaderSub = this.appHeaderService.getAppHeader().subscribe(data => {
      if ( this.options ){
        if (this.options.hasOwnProperty('heading')) {
          this.options.heading = data.header;
          this.setTitle( data.header );
        }
      }
    });

    // subscibe to the service that provides the user settings
    this.settingsSub = this.settingsService.getSettings().subscribe(data => {
      this.theme = data.theme;
      this._mode = data.sidebar;
      this.mode = this._mode;
      this.isOpened = true;
    });

  }

  ngOnInit(): void {

    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    }

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      // Scroll to top on view load
      document.querySelector('.main-content').scrollTop = 0;
      this.runOnRouteChange();
    });

    // get the user ui settings
    if ( this.sessionUser ) {
      if ( this.sessionUser.settings.theme ) this.theme = this.sessionUser.settings.theme;

      if ( this.sessionUser.settings.sidebar ){
        this._mode = this.sessionUser.settings.sidebar;
        this.mode = this._mode;
      }

      if ( !this.sessionUser.following ) {
        this.userService
          .findOneUser(this.sessionUser.id , '/following' )
          .subscribe(
          (following) => {
            this.sessionUser.following = following;
          },
          (error) => {

          });
      }
    }

  }

  ngAfterViewInit(): void {
    setTimeout(_ => this.runOnRouteChange());
  }

  ngOnDestroy() {
    this._router.unsubscribe();
  }

  runOnRouteChange(): void {
    if (this.isOver() || this.router.url === '/maps/fullscreen') {
      this.isOpened = false;
    }

    this.route.children.forEach((route: ActivatedRoute) => {
      let activeRoute: ActivatedRoute = route;
      while (activeRoute.firstChild) {
        activeRoute = activeRoute.firstChild;
      }
      this.options = activeRoute.snapshot.data;
    });

    if (this.options) {
      if (this.options.hasOwnProperty('heading')) {
        this.setTitle(this.options.heading);
      }
    }

  }

  setTitle(newTitle: string) {
    this.titleService.setTitle('CloudBase | ' + newTitle);
  }

  toogleSidebar(): void {
    this.isOpened = !this.isOpened;
  }

  isOver(): boolean {
    return window.matchMedia(`(max-width: 991px)`).matches;
  }

  openSearch(search) {
    this.modalService.open(search, { windowClass: 'search', backdrop: false });
  }

  signout() {
    this.sessionUser = null;
    this.token = null;
    this.localUser = null;
    this.localStorage.clear('token');
    this.router.navigate(['/'], { queryParams: { 'refresh': 1 } });
  }

  onSearchChange( value: string ) {


    if ( value.length < 3 ){
      return;
    }

    this.recipeService
      .searchForRecipe(value)
      .subscribe(
      (recipes) => {
        this.searchRecipeItems = recipes;
      },
      (error) => {

      });

    this.flavorService
      .searchForFlavor(value)
      .subscribe(
      (flavors) => {
        this.searchFlavorItems = flavors;
      },
      (error) => {

      });

    this.userService
      .searchForUser(value)
      .subscribe(
      (users) => {
        this.searchUserItems = users;
      },
      (error) => {

      });
  }
}
