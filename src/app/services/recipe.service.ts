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

  public findOneRecipe( id: number , populate = [] , queryParams = '' ) {

    const url = this.buildQuery( '/recipe/' + id , populate , queryParams );

    return this.http
      .get(url)
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  public findRecipes( populate = [] , queryParams = '' ) {

    const url = this.buildQuery( '/recipe' , populate , queryParams );

    return this.http
      .get(url)
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  public createRecipe( body: any ) {

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

  public updateRecipe( body: any , id: number ) {

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

  public searchForRecipe( name: String ) {

    const url = API_URL + '/recipe?where={"name":{"contains":"' + name + '"}}&limit=20';

    return this.http
      .get( url )
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    console.error(error);
    return Observable.throw(error.json());
  }

  public setAuthToken( token: string ) {
    this.token = token;
  }

  private buildQuery( resource: string , populate = [] , queryParams = '' ): string {
    let url = API_URL + resource + '?populate=[';

    populate.map( (element) => {
      url = url + element + ',';
    });

    url = url + ']';

    if ( queryParams && populate ) {
      url = url + '&' + queryParams;
    }

    if ( queryParams && !populate ) {
      url = url + '?' + queryParams;
    }

    return url;
  }

}
