import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http, Response , Headers } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.cloudBaseApiURL;

@Injectable()
export class AuthService {

  constructor( private http: Http ) {

  }

  public login( email: String , password: String ){

    const body = {
      email: email,
      password: password
    };

    return this.http
      .post(API_URL + '/auth/login', body)
      .map(response => {
        return response.json();
      })
      .catch(this.handleError);
  }

  public register( email: String , password: String , username: String ){

    const body = {
      email: email,
      password: password,
      username: username
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

  public validateToken( token: number ){

    const headers = new Headers({ 'Authorization': 'Bearer ' + token });

    return this.http
      .get(API_URL + '/auth/validate_token', { headers: headers })
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
