import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Headers, Http, Response } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

const API_URL = environment.cloudBaseApiURL;

@Injectable()
export class UploadService {

  private token = '';

  constructor( private http: Http ) { }

  public uploadRecipeImage( image: any ){

    let formData = this.buildFormData( image );

    const headers = new Headers({ 'Authorization': 'Bearer ' + this.token });

    return this.http
      .post(API_URL + '/upload?type=recipe', formData , { headers: headers })
      .map(response => {
        return response.json();
      })
      .catch((error) => {
        return Observable.throw(error);
      });
  }

  private buildFormData( image: any ): FormData{

    var binary = atob( image.split(',')[1] );
    var binary_array = [];
    for(var i = 0; i< binary.length; i++){
      binary_array.push(binary.charCodeAt(i));
    }

    var blob = new Blob([new Uint8Array(binary_array)], {type: 'image/jpeg'});
    let formData = new FormData();
    formData.append('image', blob);
    return formData;
  }

  private handleError(error: Response | any) {
    console.error(error);
    return Observable.throw(error.json());
  }

  public setAuthToken( token: string ){
    this.token = token;
  }

}
