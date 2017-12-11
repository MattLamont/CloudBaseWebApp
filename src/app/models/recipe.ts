export class Recipe {
  name: string;
  owner: any;
  flavors: any;
  pg_percent: number;
  vg_percent: number;
  flavor_percents: any;
  dilutant: number;
  steep_time: number;
  description: string;
  tags: any;
  image_url: string;
  category: string;
  likes: number;
  dislikes: number;
  views: number;

  constructor(){
    this.name = '';
    this.owner = null;
    this.flavors = [];
    this.pg_percent = 50;
    this.vg_percent = 50;
    this.flavor_percents = [];
    this.dilutant = 0;
    this.steep_time = 0;
    this.description = '';
    this.tags = [];
    this.image_url = '';
    this.category = 'Other';
    this.likes = 0;
    this.dislikes = 0;
    this.views = 0;
  }
}
