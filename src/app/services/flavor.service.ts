import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.cloudBaseApiURL;

@Injectable()
export class FlavorService {

  constructor( private http: Http ) { }

  public searchForFlavor( name: String ){

    let url = API_URL + '/flavor?where={"name":{"contains":"' + name + '"}}&limit=5';

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

}
