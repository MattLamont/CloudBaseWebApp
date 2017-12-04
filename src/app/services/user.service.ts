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

  public updateUser( body: any ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .put(API_URL + '/user/' + body.id , body , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public findOneUser( id: Number ){

    return this.http
      .get(API_URL + '/user/' + id )
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

}
