import { Component } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { Platform } from '@ionic/angular';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  public appPages = [
    { title: 'Inbox', url: '/folder/Inbox', icon: 'mail' },
    { title: 'Outbox', url: '/folder/Outbox', icon: 'paper-plane' },
    { title: 'Favorites', url: '/folder/Favorites', icon: 'heart' },
    { title: 'Archived', url: '/folder/Archived', icon: 'archive' },
    { title: 'Trash', url: '/folder/Trash', icon: 'trash' },
    { title: 'Spam', url: '/folder/Spam', icon: 'warning' },
  ];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  constructor(
    private splashScreen: SplashScreen,
    private platform: Platform,
    private androidPermissions: AndroidPermissions
    // private statusBar: StatusBar,
  ) {
    this.initializeApp();
  }


  initializeApp() {
    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.checklocationpermission()
    });
    // this.navCntrl.navigateRoot('login')
  }

  checklocationpermission(){
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(
      result => console.log('Has permission?',result.hasPermission), 
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
    );
    
    this.androidPermissions.requestPermissions([
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION, 
      this.androidPermissions.PERMISSION.ACCESS_BACKGROUND_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
    ]);
  }



}
