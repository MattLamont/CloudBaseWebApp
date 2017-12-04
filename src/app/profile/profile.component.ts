import { Component , OnInit } from '@angular/core';
import { ActivatedRoute , Router } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  userId: Number;
  public user: any;

  public dataLoaded = false;

  constructor(
      private route: ActivatedRoute,
      private router: Router,
      private userService: UserService
    )
  {
  }


  ngOnInit(){
    this.route.params.subscribe(params => {
      this.userId = params['id'];

      this.userService
        .findOneUser(this.userId)
        .subscribe(
        (user) => {
          this.user = user;
          this.dataLoaded = true;
        },
        (error) => {
          this.router.navigate(['/404']);
        });
    });
  }
}
