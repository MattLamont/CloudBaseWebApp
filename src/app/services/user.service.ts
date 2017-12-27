import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.cloudBaseApiURL;

@Injectable()
export class UserService {

  private token = '';

  constructor( private http: Http ) { }

  public updateUser( id: number , body: any ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .put(API_URL + '/user/' + id , body , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public findOneUser( id: Number , populate = [] ){

    let url = this.buildQuery( '/user/' + id , populate );

    return this.http
      .get(url)
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public findOneRecipeLike( userId: number , recipeId: number ){

    let url = API_URL + '/user/' + userId + '/liked_recipes/' + recipeId;

    return this.http
      .get(url)
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public findOneRecipeSave( userId: number , recipeId: number ){

    let url = API_URL + '/user/' + userId + '/saved_recipes/' + recipeId;

    return this.http
      .get(url)
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public addRecipeLike( userId: number , recipeId: number ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .post(API_URL + '/user/' + userId + '/liked_recipes/' + recipeId , null , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public addRecipeSave( userId: number , recipeId: number ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .post(API_URL + '/user/' + userId + '/saved_recipes/' + recipeId , null , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public removeRecipeLike( userId: number , recipeId: number ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .delete(API_URL + '/user/' + userId + '/liked_recipes/' + recipeId , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public removeRecipeSave( userId: number , recipeId: number ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .delete(API_URL + '/user/' + userId + '/saved_recipes/' + recipeId , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public setAuthToken( token: string ){
    this.token = token;
  }

  private handleError(error: Response | any) {
    console.error(error);
    return Observable.throw(error.json());
  }

  private buildQuery( resource: string , populate = [] ): string{
    let url = API_URL + resource + '?populate=[';

    populate.map( (element) => {
      url = url + element + ',';
    });

    url = url + ']';
    return url;
  }

}
