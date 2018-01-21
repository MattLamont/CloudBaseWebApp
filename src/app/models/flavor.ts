export class Flavor {
  name: string;
  manufacturer: string;
  link: string;
  image_url: string;
  description: string;
  likes: number;
  dislikes: number;
  category: string;

  constructor(){
    this.name = '';
    this.manufacturer = 'Flavor';
    this.link = '';
    this.image_url = '';
    this.description = '';
    this.likes = 0;
    this.dislikes = 0;
    this.category = '';
  }
}
