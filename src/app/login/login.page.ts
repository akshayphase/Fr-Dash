import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { DataService } from '../services/data.service';
import { Device } from '@ionic-native/device/ngx';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: any;
  password: any;
  showLoader=false;
  constructor(
    private dataservice: DataService, 
    private router: Router,
    private de: Device) { }

  ngOnInit() {
    if(JSON.parse(localStorage.getItem('user')) != null){
      this.router.navigateByUrl("/dashboard");
    }
  }

  login() {
    localStorage.clear();
    var today = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    localStorage.setItem('today', today);
    this.showLoader=true;
    var deviceid = this.de.uuid;
    let data = {
      userName: this.username,
      password: this.password,
      deviceId: deviceid
    }; 
  
    if(this.username != "" && this.password!="" && this.username != null && this.password!=null){
      this.dataservice.login(data).subscribe((res:any)=>{
        this.showLoader=false;
        if(res.status == "Success"){
          // if(res.enabled == "Y"){
          if(res.roleId == "20" || res.roleId == "30" && res.enabled == "Y"){
            this.dataservice.storeEncrData("user", res);
            this.router.navigateByUrl('/dashboard');
          }else{
            this.dataservice.presentAlert("Error !","You are not authorized to login", "Unauthorized user!")
          }
        }else{
          this.dataservice.presentAlert("Error !","Login failed. Please Enter correct details", "Wrong Username/ Password")
        }
      },(error)=>{
        console.log((error))
        this.showLoader=false;
        this.dataservice.presentAlert("Error !",error.message, "Error")

      })
    }else{
      this.showLoader=false;
      this.dataservice.presentAlert("Error !","Please enter details", "Enter Username/ Password")
    }
  }



}
