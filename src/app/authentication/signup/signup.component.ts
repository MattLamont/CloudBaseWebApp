import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from 'ng2-validation';

import { AuthService } from '../../services/auth.service';
import {LocalStorageService, SessionStorageService} from 'ngx-webstorage';

const password = new FormControl('', Validators.required);
const confirmPassword = new FormControl('', CustomValidators.equalTo(password));

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public form: FormGroup;
  public errorMessage = '';

  constructor(private fb: FormBuilder, private router: Router , private authService: AuthService , private localStorage: LocalStorageService , private sessionStorage: SessionStorageService) {}

  ngOnInit() {
    this.form = this.fb.group( {
      email: [null , Validators.compose ( [ Validators.required ] )],
      uname: [null , Validators.compose ( [ Validators.required ] )],
      password: password,
      confirmPassword: confirmPassword
    } );
  }

  onSubmit() {

    if( this.form.value.password !== this.form.value.confirmPassword ){
      this.errorMessage = 'Password and confirm password do not match!'
      return;
    }

    this.authService
        .register( this.form.value.email , this.form.value.password , this.form.value.uname )
        .subscribe(
        (user) => {
          this.sessionStorage.store( 'user' , user );
          this.loginNewUser( user );
        },
        (error) => {
          if( error._body != null ){
            this.errorMessage = error._body;
          }
          else{
            this.errorMessage = 'Unknown Error. Please try again later';
          }
        });
  }

  loginNewUser( user: any){
    this.authService
        .login( user.email , this.form.value.password )
        .subscribe(
        (user) => {
          this.sessionStorage.store( 'token' , user.token );
          this.router.navigate ( [ '/' ] );
        },
        (error) => {
          this.errorMessage = 'Unknown Error. Please try again later';
        });
  }

}
