import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, NavController, Platform } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Storage } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { filter } from 'rxjs/operators';



declare var google;

@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.page.html',
  styleUrls: ['./tracking.page.scss'],
})
export class TrackingPage implements OnInit {
  @ViewChild('map') mapElement:ElementRef
  map: any;
  currentMapTrack = null;
  isTracking=false;
  trackedRoute=[];
  previousTracks=[];
  positionSubscription:Subscription;
  private _storage: Storage | null = null;


  constructor(
    private router:Router,
    private plt:Platform,
    private geolocation:Geolocation,
    private storage: Storage,
    private alertCtrl:AlertController
    ) {     this.initStorage();
    }
  
    async initStorage() {
      const storage = await this.storage.create();
      this._storage = storage;
    }
    
    async ngOnInit() {
      // If using a custom driver:
      // await this.storage.defineDriver(MyCustomDriver)
      await this.storage.create();
    }

    ionViewDidEnter(){
      this.plt.ready().then(() =>{
        this.loadHistoricRoutes();
        let mapOptions={
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP,
          mapTypeControl: false,
          streetViewControl:false,
          fullscreenControl:false
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        this.geolocation.getCurrentPosition().then(pos=>{
          let latlng = new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude);
          this.map.setCenter(latlng);
          this.map.setZoom(15)
        }, err => { console.log(err)})
      })
    }

    loadHistoricRoutes(){
      this.storage.get('routes').then(data=>{
        if(data != null){
          this.previousTracks = data;}
      })
    }

    startTracking(){
      this.isTracking =true;
      this.trackedRoute =[];
      this.positionSubscription = this.geolocation.watchPosition()
      .pipe(filter((p:any)=>p.coords !=undefined ))
      .subscribe((data:any)=>{
        setTimeout(() => {
          this.trackedRoute.push({ lat:data.coords.latitude, lng:data.coords.longitude});
          this.redrawPath(this.trackedRoute)
          console.log(this.trackedRoute)
        }, 5000);
      })
    };
    redrawPath(path:any){
      if(this.currentMapTrack){this.currentMapTrack.setMap(null)}
      if(path.length >1){
        this.currentMapTrack = new google.maps.Polyline({
          path:path,
          geodesic: true,
          strokeColor: '#123E6F',
          strokeOpacity:1,
          strokeWeight: 3
        });
        this.currentMapTrack.setMap(this.map);
        console.log(this.currentMapTrack)
      }
    };
    stopTracking(){
      this.isTracking =false;
      let newRoute= {finished: new Date().getTime(), path: this.trackedRoute}
      console.log(newRoute)
      this.previousTracks.push(newRoute);
      this.storage.set('routes', this.previousTracks);
      this.positionSubscription.unsubscribe();
      this.currentMapTrack.setMap(null);
    };
    showHistory(path:any){
      this.redrawPath(path)
    };



  logout(){
    // localStorage.clear();
    localStorage.removeItem("user");
    this.router.navigateByUrl('/login'); 
  }

  clearStorage(){
    this.storage.clear();
    window.location.reload();
  }
}
