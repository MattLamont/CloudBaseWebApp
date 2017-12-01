import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.cloudBaseApiURL;

@Injectable()
export class AuthService {

  constructor( private http: Http ) {

  }

  public login( username: String , password: String ){

    let body = {
      username: username,
      password: password
    };

    return this.http
      .post(API_URL + '/auth/login', body)
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public register( email: String , password: String ){

    let body = {
      email: email,
      password: password
    };

    return this.http
      .post(API_URL + '/register', body)
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

}
