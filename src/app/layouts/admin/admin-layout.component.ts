import { Component, OnInit, OnDestroy, ViewChild, HostListener, AnimationTransitionEvent, NgZone, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { MenuItems } from '../../shared/menu-items/menu-items';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';
import { TranslateService } from '@ngx-translate/core';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';
import { AppHeaderService } from '../../services/appheader.service';
import { RecipeService } from '../../services/recipe.service';

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

  public user: any;

  currentLang = 'en';
  options: Options;
  theme = 'light';
  showSettings = false;
  isDocked = false;
  isBoxed = false;
  isOpened = true;
  mode = 'push';
  _mode = this.mode;
  _autoCollapseWidth = 991;
  width = window.innerWidth;

  appHeaderSub: Subscription;

  searchItems = [];

  @ViewChild('sidebar') sidebar;

  constructor(
    public menuItems: MenuItems,
    private router: Router,
    private route: ActivatedRoute,
    public translate: TranslateService,
    private modalService: NgbModal,
    private titleService: Title,
    private zone: NgZone,
    private localStorage: LocalStorageService,
    private sessionStorage: SessionStorageService,
    private appHeaderService: AppHeaderService,
    private recipeService: RecipeService
  ) {
    const browserLang: string = translate.getBrowserLang();
    translate.use(browserLang.match(/en|fr/) ? browserLang : 'en');
    this.mediaMatcher.addListener(mql => zone.run(() => this.mediaMatcher = mql));

    //subscibe to the service that provides the header title for each page
    this.appHeaderSub = this.appHeaderService.getAppHeader().subscribe(data => {
      if( this.options ){
        if (this.options.hasOwnProperty('heading')) {
          this.options.heading = data.header;
        }
      }
    });
  }

  ngOnInit(): void {

    if (this.isOver()) {
      this._mode = 'over';
      this.isOpened = false;
    }

    this.user = this.sessionStorage.retrieve('user');

    this.sessionStorage.observe('user')
      .subscribe((value) => {
        this.user = value;
      });

    this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
      // Scroll to top on view load
      document.querySelector('.main-content').scrollTop = 0;
      this.runOnRouteChange();
    });

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
    this.sessionStorage.clear('user');
    this.sessionStorage.clear('token');
    this.localStorage.clear('user');
    this.localStorage.clear('token');
    this.router.navigate(['/'], { queryParams: { 'refresh': 1 } });
  }

  onSearchChange( value: string ){


    if( value.length < 3 ){
      return;
    }

    this.recipeService
      .searchForRecipe(value)
      .subscribe(
      (recipes) => {
        this.searchItems = recipes;
      },
      (error) => {

      });
  }
}
