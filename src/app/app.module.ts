import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './services/sharedModule';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { AndroidPermissions } from '@awesome-cordova-plugins/android-permissions/ngx';
import { IonicStorageModule } from '@ionic/storage-angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';
import { Uid } from '@ionic-native/uid/ngx';
import { Device } from '@ionic-native/device/ngx';




@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule, 
    HttpClientModule,SharedModule,
    IonicStorageModule.forRoot()
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, StreamingMedia,
    Geolocation,
    AndroidPermissions,
    SplashScreen,
    Uid,
    Device,
    UniqueDeviceID,
    NativeGeocoder,],
  bootstrap: [AppComponent],
})
export class AppModule {}


/**
 * ionic cordova build android --prod --release
 * keytool -genkey -v -keystore fr-dash-key.keystore -alias ivis -keyalg RSA -keysize 2048 -validity 10000
 * jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore fr-dash-key.keystore platforms/android/app/build/outputs/bundle/release/app-release.aab ivis
 * bundletool build-apks --bundle=platforms/android/app/build/outputs/bundle/release/app-release.aab --output=app-release.apk --mode=universal
 * ./zipalign.exe -v 4 platforms/android/app/build/outputs/bundle/release/app-release.aab fr-dash.aab
 * 
 * 
 * 
 * 
 * for apk
 * ionic cordova build android --prod --release
 * jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore fr-dash-key.keystore platforms/android/app/build/outputs/apk/debug/app-debug.apk ivis
 * ./zipalign.exe -v 4 platforms/android/app/build/outputs/apk/debug/app-debug.apk fr-dash.apk
 */


/*


Notes: 
1. Remove min and max sdk versio when publishing app (remove from config.xml file) / maxversion to latest
2. update network_security_config.xml file with default code given below: (path: resources/android/xml)
<!-- <?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
    </domain-config>
</network-security-config> -->
3. always include  android:usesCleartextTraffic="true" permission to access HTTP (add inside edit-config tag -> inside aplication tag )
*/




/**
 * For geolocation tracking
 * ionic cordova plugin add cordova-sqlite-storage
 * ionic cordova plugin add cordova-plugin-geolocation --variable GEOLOCATION_USAGE_DESCRIPTION="To track route"
 * npm install --save @ionic-native/geolocation
 * ** add at bottom of config.xml file before </widget>
 * <edit-config file="*-info.plist" mode="merge" target="NSLocationWhenInUseUsageDescription">
 *  <string>This app wants to track your location</string>
 * </edit-config>
 * 
 * import Geolocation and IonicStorageModule in app.module  
 * put in imports IonicStorageModule.forRoot() and Geolocation in providers
 * 
 * in index.html put following to get google map in your app
 * <script src="http://mpas.google.com/maps/api/js?key=YOUR_API_KEY_HERE"></script>
 * 
 * 
 * 
 */