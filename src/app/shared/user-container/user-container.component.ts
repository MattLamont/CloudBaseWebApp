import { Component , Input , Output , EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent {

  @Input()
  users: any;

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
