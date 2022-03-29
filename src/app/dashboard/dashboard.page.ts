import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertService } from '../services/alertservice/alert-service.service';
import { DataService } from '../services/data.service';



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
    private geolocation: Geolocation,    
    private androidPermissions: AndroidPermissions,
    private alertservice:AlertService) { }

  ngOnInit() {
 
  }
  /*  this is important */
  ionViewWillEnter(){
    this.user = this.dataservice.getEncrData('user');
    this.getTickets();
    if(this.user == null){
      this.router.navigateByUrl("/login")
     }
     this.checklocation();
  }

  checklocation(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {console.log('Has permission?',result.hasPermission)
        if(result.hasPermission == false){
          this.router.navigateByUrl('/location')
        }
      }, 
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    );
  }

  logout(){
    // localStorage.clear();
    localStorage.removeItem("user");
    this.router.navigateByUrl('/login'); 
  }

  getTickets(){
    let id = this.user.id;
    this.showLoader=true;
    this.dataservice.getOpenTickets(id).subscribe((res:any)=>{
      this.showLoader=false;
      if(res.Message !="Tickets are not available"){
      this.tickets = res;
      this.updateTicketdata();
      }
      else{
        this.tickets = [];
      }
    })
  }
  savedstatus:any;
  saveTicketStatusLocally(){
    var status = [];
    this.tickets.forEach((el:any) => {
      if(el.latitude == "" || el.latitude == null){
        status.push({id:el.id, status:"unopened"})
      }else{
        status.push({id:el.id, status:"registered"})
      }
      localStorage.setItem('ticketstaus', JSON.stringify(status))
      this.savedstatus = (JSON.parse(localStorage.getItem('ticketstaus')))
    });
  }
  updateTicketdata(){
    this.savedstatus = (JSON.parse(localStorage.getItem('ticketstaus')));
    var day = new Date().toJSON().slice(0,10).replace(/-/g,'/');
    var savedday = localStorage.getItem('today');
    if(this.savedstatus){
      if(day != savedday){this.saveTicketStatusLocally(); console.log("day does not match")}
      if(this.savedstatus == undefined){this.saveTicketStatusLocally(); console.log("no data")}
      if(day == savedday && this.savedstatus != undefined){
        console.log("well i am refreshing");
        if(this.tickets.length > this.savedstatus.length){
          this.tickets.forEach((el:any) => {
            this.savedstatus.forEach((item)=>{
              if(item.id != el.id){
                this.savedstatus.push({id:el.id, status:"unopened"})
                localStorage.setItem('ticketstaus', JSON.stringify(this.savedstatus))
              }
            })
          });
        }
      }
    }else{
      this.saveTicketStatusLocally()
    }
  }
  color(ticket:any){
    if(ticket.latitude != null){
      return 'registered'
    }else{       
      var x = (JSON.parse(localStorage.getItem('ticketstaus')))
      if(x){
        var y = x.filter(function( obj ) {return obj.id === ticket.id;}); 
        return y.status;
      }
    }
  }
  currenTicket:any;
  saveCoOrds(ticket:any){
    if(ticket.latitude == null){
      this.updateTicketdata();
      this.showLoader=true;
      this.currenTicket=ticket;
      if(this.savedstatus){
        var x = (JSON.parse(localStorage.getItem('ticketstaus')))
        if(ticket.latitude == null){
          x.find(v => v.id == ticket.id).status = 'unregistered';
          localStorage.setItem('ticketstaus', JSON.stringify(x))
          this.savedstatus = x
        }
      }
      this.geolocation.getCurrentPosition().then((resp) => {
        setTimeout(() => {
          this.showLoader = false;
        }, 2000);
        this.currentlatitude = resp.coords.latitude;
        this.currentlongitude = resp.coords.longitude;
        this.getAccount(ticket.accountId);
       }).catch((error) => {
         console.log('Error getting location', error);
       });
    }else{
      alert("Latitude and Longitude already captured")
    }
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
          alert(`Observed Latitude and Longitude do not match with site data. Please contact Co-Ordinator / Manager \n \n \n Current Latitude is ${this.currentlatitude} \n Current Longitude is ${this.currentlongitude}`)
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


