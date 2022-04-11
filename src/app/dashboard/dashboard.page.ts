import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { Device } from '@ionic-native/device/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { AlertController } from '@ionic/angular';
import { DataService } from '../services/data.service';





@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  user:any;
  cols =['ticketid','accountName'];
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
  showLoader = false;
  minDistance:any;
  imei:any;

  constructor(
    private dataservice: DataService, 
    private router: Router, 
    private de: Device,
    private geolocation: Geolocation,    
    private androidPermissions: AndroidPermissions,
    public alertservice: AlertController
    ) { }

  ngOnInit() {
    // console.log(this.dataservice.DateFormatter.formatDate(new Date('2021-07-22 23:59:59'), 'YYYY-MM-DD HH:mm:ss')); 
    // console.log(this.distance1(26.2153583, 81.2438148,26.2151,81.2467, 0))
  }

  getUniqueDeviceID() {
    ('Device UUID is: ' + this.de.uuid)
  }
  /*  this is important */
  ionViewWillEnter(){
    this.user = this.dataservice.getEncrData('user');
    this.getTickets();
    if(this.user == null){
      this.router.navigateByUrl("/login")
     }
     this.checklocation();
    //  this.getUniqueDeviceID()
  }
  checklocation(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => {if(result.hasPermission == false){this.router.navigateByUrl('/location')}}, 
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION));
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
        var searchStr = (this.dataservice.DateFormatter.formatDate(new Date(), 'YYYY-MM-DD')); 
        var abc = res;
        this.tickets = abc.filter(x => x.scheduledDate.toLowerCase().includes(searchStr.toLowerCase()))
        // this.tickets = res
        // var y =  abc.filter( h => h.scheduledDate.includes(searchStr) );
        this.updateTicketdata();
      }
      else{
        this.tickets = [];
      }
    })
  } 
  currenTicket:any;
  saveCoOrds(ticket:any){
    console.log(ticket)
    if(ticket.latitude == null || ticket.latitude == "" || ticket.longitude == ""){
      this.updateTicketdata();
      this.showLoader=true;
      this.currenTicket=ticket;
      // if(this.savedstatus){
      //   var x = (JSON.parse(localStorage.getItem('ticketstaus')))
      //   if(ticket.latitude == null){
      //     x.find(v => v.id == ticket.id).status = 'unregistered';
      //     localStorage.setItem('ticketstaus', JSON.stringify(x))
      //     this.savedstatus = x
      //   }
      // }
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
      this.dataservice.presentAlert("Information !","Latitude and Longitude already captured", "Already Registered!")
    }
  }
  getmindist(){
    this.dataservice.getMinDist().subscribe((data:any)=>{
      this.minDistance = data;
    })
  }
  getAccount(id:any){
    this.getmindist();
    this.dataservice.getAccount(id).subscribe((res:any)=>{
      this.latitude = Number(res[0].latitude);
      this.longitude = Number(res[0].longitude);
      var today = (this.dataservice.DateFormatter.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')); 
      if(this.latitude,this.longitude,this.currentlatitude,this.currentlongitude){
        var x = this.distance(this.latitude,this.longitude,this.currentlatitude,this.currentlongitude, "K");
        var dist;
        if(this.minDistance){dist = (this.minDistance/1000)}else{dist = 0.2}
        if(x< dist){
          this.currenTicket.latlongverified = "T";
          this.currenTicket.loginTime = today;
          this.currenTicket.latitude =this.currentlatitude;
          this.currenTicket.longitude =this.currentlongitude;
          this.showLoader=true;
          this.dataservice.updatecords(this.currenTicket).subscribe((res:any)=>{
            this.showLoader=false;
            this.dataservice.presentAlert("Response !","",res.Message);
          })
        }else{
          this.currenTicket.longitude = "FailedAttempt";
          this.dataservice.updatecords(this.currenTicket).subscribe((res:any)=>{
            this.showLoader=false;
          })
          this.presentAlert(`Ticket Id : ${this.currenTicket.ticketid} <br/>Unit Id : ${this.currenTicket.unitId} <br/><br/>Current Lat-Long : <br/>${this.currentlatitude} - ${this.currentlongitude} <br/><br/>Site Manager Lat-Long : <br/>${this.latitude} - ${this.longitude} <br/><br/>  <b>Total Difference : ${(Math.round(x*100)/100)} Kms</b> <br/>Please Contact Site Manager Team as per region : `)
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
    function toRadians(value) {return value * Math.PI / 180}
    var R = 6371.0710
    var rlat1 = toRadians(lat1) // Convert degrees to radians
    var rlat2 = toRadians(lat2) // Convert degrees to radians
    var difflat = rlat2 - rlat1 // Radian difference (latitudes)
    var difflon = toRadians(lon1 - lon2) // Radian difference (longitudes)
    return 2 * R * Math.asin(Math.sqrt(Math.sin(difflat / 2) * Math.sin(difflat / 2) + Math.cos(rlat1) * Math.cos(rlat2) * Math.sin(difflon / 2) * Math.sin(difflon / 2)))
  }



  async presentAlert(msg:any) { 
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'alert';
    alert.header = 'Warning !';
    alert.subHeader = 'Co-ordinates do not match';
    alert.message = msg;
    alert.buttons= [
	    // {
	    //   text: "Call : +91-91542 04944",
	    //   handler: () => {window.open("tel:+919154204944")},
	    // },
	    // {
	    //   text: "Call : +91-91549 05657",
	    //   handler: () => {window.open("tel:+919154905657")},
	    // },
      // {
	    //   text: "Call : +91-91210 55728",
	    //   handler: () => {window.open("tel:+919121055728")},
	    // },
      {
	      text: "KTK / WB - Mukesh P",
	      handler: () => {window.open("tel:+918106689090")},
	    },
      {
	      text: "AP / TS / TN - Suresh B",
	      handler: () => {window.open("tel:+919100054322")},
	    },
      {
	      text: "MH / GJ / OD - Anji Reddy",
	      handler: () => {window.open("tel:+919346011010")},
	    },
      {
	      text: "UP/DL/RJ/PB/JK - Amir Khan",
	      handler: () => {window.open("tel:+919660664242")},
	    },
      {
	      text: "CG/KL/AS/BH/MP - Hari Kishore",
	      handler: () => {window.open("tel:+919542221222")},
	    }, 
      {
	      text: "Cancel",
        role : 'cancel',
	    }
	  ],
    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss().then(()=>{
    });
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

}


