import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';

@Component({
  selector: 'app-location',
  templateUrl: './location.page.html',
  styleUrls: ['./location.page.scss'],
})
export class LocationPage implements OnInit {

  constructor(
    private androidPermissions: AndroidPermissions,
    private router: Router) { }

  ngOnInit() {
    this.checklocation()
  }


  checklocation(){
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {console.log('Has permission?',result.hasPermission)
        if(result.hasPermission == true){
          this.router.navigateByUrl('/dashboard')
        }
      }, 
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    );
  }
}
