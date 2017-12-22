import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-recipe-container',
  templateUrl: './recipe-container.component.html',
  styleUrls: ['./recipe-container.component.scss']
})
export class RecipeContainerComponent {

  @Input()
  recipes: any;

  constructor() { }

  ngOnInit() {

  }

}
