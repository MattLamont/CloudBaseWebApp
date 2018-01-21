import { Component , Input , Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-recipe-container',
  templateUrl: './recipe-container.component.html',
  styleUrls: ['./recipe-container.component.scss']
})
export class RecipeContainerComponent {

  @Input()
  recipes: any;

  @Input()
  type = 'cards';

  @Input()
  showLoadMoreButton = false;

  @Input()
  showLoadingSpinner = false;

  @Input()
  gridClass = 'col-xl-3 col-lg-4 col-md-6 col-sm-6';

  @Output()
  onLoadMoreClick = new EventEmitter();

  constructor() { }

  ngOnInit() {

  }

}
