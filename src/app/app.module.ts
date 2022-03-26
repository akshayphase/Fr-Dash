import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';
import { StreamingMedia } from '@ionic-native/streaming-media/ngx';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './services/sharedModule';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';



@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule,SharedModule],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }, StreamingMedia,
    Geolocation,
    SplashScreen,
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
