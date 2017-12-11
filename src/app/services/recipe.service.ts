import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.cloudBaseApiURL;

@Injectable()
export class RecipeService {

  private token = '';

  constructor( private http: Http ) { }

  public findOneRecipe( id: number ){

    return this.http
      .get(API_URL + '/recipe/' + id )
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  public findRecipes(){

    return this.http
      .get(API_URL + '/recipe' )
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  public createRecipe( body: any ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .post(API_URL + '/recipe', body , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  public updateRecipe( body: any , id: number ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .put(API_URL + '/recipe/' + id , body , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  private handleError(error: Response | any) {
    console.error(error);
    return Observable.throw(error.json());
  }

  public setAuthToken( token: string ){
    this.token = token;
  }

}
