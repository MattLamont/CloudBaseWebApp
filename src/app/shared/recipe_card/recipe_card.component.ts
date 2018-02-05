import { Component , Input } from '@angular/core';

@Component({
  selector: 'app-recipe-card',
  templateUrl: './recipe_card.component.html',
  styleUrls: ['./recipe_card.component.scss']
})
export class RecipeCardComponent {

  @Input()
  recipe: any;

  constructor() { }

  ngOnInit() {
  }

}
