import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';
import { Platform } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';



@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  user:any;
  cols =['ticketid','facility'];
  tickets:any;
  latitude: any; 
  longitude: any;
  currentlatitude: any; 
  currentlongitude: any;
  options = {
    timeout: 10000, 
    enableHighAccuracy: true, 
    maximumAge: 3600
  };
  showLoader = false

  constructor(
    private dataservice: DataService, 
    private router: Router, 
    platform: Platform,
    private geolocation: Geolocation) { }

  ngOnInit() {
    this.user = this.dataservice.getEncrData('user');
    if(this.user == null){
      this.router.navigateByUrl("/login")
    }else{
      this.getTickets();
    }
  }

  logout(){
    localStorage.clear();
    this.router.navigateByUrl('/login');  
  }

  getTickets(){
    let id = this.user.id;
    this.showLoader=true;
    this.dataservice.getOpenTickets(id).subscribe((res:any)=>{
      this.showLoader=false;
      console.log(res)
      if(res.Message !="Tickets are not available"){
      this.tickets = res;}
      else{
        this.tickets = [];
      }
    })
  }
  currenTicket:any;
  saveCoOrds(ticket:any){
    this.showLoader=true;
    this.currenTicket=ticket;
    this.geolocation.getCurrentPosition().then((resp) => {
      this.showLoader = false;
      this.currentlatitude = resp.coords.latitude;
      this.currentlongitude = resp.coords.longitude;
      this.getAccount(ticket.accountId);
     }).catch((error) => {
       console.log('Error getting location', error);
     });
  }
  getAccount(id:any){
    this.dataservice.getAccount(id).subscribe((res:any)=>{
      this.latitude = Number(res[0].latitude);
      this.longitude = Number(res[0].longitude);
      if(this.latitude,this.longitude,this.currentlatitude,this.currentlongitude){
        var x = this.distance(this.latitude,this.longitude,this.currentlatitude,this.currentlongitude, "K");
        if(x<0.2){
          this.currenTicket.latitude =this.currentlatitude;
          this.currenTicket.longitude =this.currentlongitude;
          this.showLoader=true;
          this.dataservice.updatecords(this.currenTicket).subscribe((res:any)=>{
            this.showLoader=false;
            alert(res.Message)
          })
        }else{
          alert("Failed: Please make sure you are within 100mtrs of ATM")
        }
      }
    })
  }



  distance(lat1, lon1, lat2, lon2, unit) {
    var radlat1 = Math.PI * lat1/180
    var radlat2 = Math.PI * lat2/180
    var theta = lon1-lon2
    var radtheta = Math.PI * theta/180
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    dist = Math.acos(dist)
    dist = dist * 180/Math.PI
    dist = dist * 60 * 1.1515
    if (unit=="K") { dist = dist * 1.609344 }
    if (unit=="N") { dist = dist * 0.8684 }
    return dist
  }
  distance1(lat1, lon1, lat2, lon2, unit) {
   var a =  { x: lat1, y: lon1 };
   var b ={ x: lat2, y: lon2 }
    function toRadians(value) {
      return value * Math.PI / 180
    }
    var R = 6371.0710
    var rlat1 = toRadians(lat1) // Convert degrees to radians
    var rlat2 = toRadians(lat2) // Convert degrees to radians
    var difflat = rlat2 - rlat1 // Radian difference (latitudes)
    var difflon = toRadians(lon1 - lon2) // Radian difference (longitudes)
    console.log(2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2))))
    return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)))
  }


}


