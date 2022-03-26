import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from '../services/alertservice/alert-service.service';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  username: any;
  password: any;
  showLoader=false;
  constructor(private dataservice: DataService, private router: Router,private alertService:AlertService) { }

  ngOnInit() {
    if(JSON.parse(localStorage.getItem('user')) != null){
      // this.router.navigateByUrl("/dashboard");
    }
  }

  login() {
    this.showLoader=true;
    let data = {
      "userName": this.username,
      "password": this.password
    }; 
  
    if(this.username != "" && this.password!=""){
      this.dataservice.login(data).subscribe((res:any)=>{
        console.log(res)
        this.showLoader=false;
        if(res.status == "Success"){
          if(res.roleId == "20" && res.enabled == "Y"){
            this.dataservice.storeEncrData("user", res);
            this.router.navigateByUrl('/dashboard')
          }else{
            this.alertService.success("You are not authorized to login")
          }
        }else{
          this.alertService.success("Login failed. Please Enter correct details")
        }
      },(error)=>{
        console.log(error)
        this.showLoader=false;
        this.alertService.success(error.message)

      })
    }else{
      this.showLoader=false;
      this.alertService.success("Please enter details")
    }
  }


}
