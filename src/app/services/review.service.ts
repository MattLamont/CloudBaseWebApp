import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.cloudBaseApiURL;

@Injectable()
export class ReviewService {

  private token = '';

  constructor( private http: Http ) { }

  public findReviews( populate = [] , queryParams = '' ){

    let url = this.buildQuery( '/review' , populate , queryParams );

    return this.http
      .get(url)
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  public findOneReview( id: number , populate = [] ){

    let url = this.buildQuery( '/review/' + id , populate );

    return this.http
      .get(url)
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  public create( body: any ){

    let url = API_URL + '/review';
    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .post(url , body , {headers: headers})
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

  private buildQuery( resource: string , populate = [] , queryParams = '' ): string{
    let url = API_URL + resource + '?populate=[';

    populate.map( (element) => {
      url = url + element + ',';
    });

    url = url + ']';

    if( queryParams && populate ){
      url = url + '&' + queryParams;
    }

    if( queryParams && !populate ){
      url = url + '?' + queryParams;
    }

    return url;
  }

}
