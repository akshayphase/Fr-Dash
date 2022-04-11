import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DataService {

    // var headers = new Headers();
    // headers.append('Access-Control-Allow-Origin' , '*');
    // headers.append('Access-Control-Allow-Methods', 'POST, GET, OPTIONS, PUT');
    // headers.append('Accept','application/json');
    // headers.append('content-type','application/json');
    // let options = new RequestOptions({headers:headers});

  headerDict = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT'
  };
  requestOptions = {                                                                                                                                                                                 
      headers: new HttpHeaders(this.headerDict), 
  };

  baseurl = "https://crm.iviscloud.net/frdashboard/"
  // baseurl = "http://smstaging.iviscloud.net:8090/frdashboard/";
  // baseurl = "http://localhost:8080/";
  // baseurl = "http://10.0.2.192:8080/frdashboard/";

  constructor(private http: HttpClient) { }

  login(payload:any){
    let url =this.baseurl+"login";
    return  this.http.post(url,payload,this.requestOptions);
  }
  getOpenTickets(user:any){
    let url=this.baseurl+"getTickets";
    let payload={
        "assignedTo": user,
        "status": "Pending"
    }
    return  this.http.post(url,payload);
  }
  getAccount(id:any){
    let url = this.baseurl+`getAccount/${id}`;
    return this.http.get(url);
  }
  updatecords(payload:any){
    let url = this.baseurl+"updatecoords";
    return this.http.put(url,payload);
  }
  getSparesDetails(payload:any){
    let url=this.baseurl+"getFieldSpares";
    return this.http.post(url,payload);
  }  
  getAddSpareDetails(){
    let url=this.baseurl+"getSparesInfoForNew";
    return this.http.get(url);
  }
  updateSparesDetails(payload:any){
    let url=this.baseurl+"updateFieldSpares";
    return this.http.put(url,payload);
  }

  storeEncrData(storageKey: string, value: any){
    const y = btoa(escape(JSON.stringify(value)));
    var a =({
      key: storageKey,
      value: y
    }); 
    localStorage.setItem(`${storageKey}`, JSON.stringify(a));
  }
  getEncrData(key:string){
    const res = JSON.parse(localStorage.getItem(key)!);
     if(res){
      if(res.value){
        (JSON.parse(unescape(atob(res.value))))
         return JSON.parse(unescape(atob(res.value)));
       }else{
         return false;
       }
     }else{
       return null;
     }
  }
  getMinDist(){
    let url = this.baseurl+`getMinDistance`;
    return this.http.get(url);
  }
  sessionstatus(){
    var hours = 3; // 0.01 is 35secs
    var now:any = new Date().getTime();
    var setupTime:any = localStorage.getItem('ge%1=wd2a');
    if (setupTime == null) {
        localStorage.setItem('ge%1=wd2a', now)
    } else {
    if(now-setupTime > hours*60*60*1000) {
        localStorage.setItem('ge%1=wd2a', now);
        return false;
      }
    }
    return true;
  }
  async presentAlert(title:any,msg:any, sub:any) { 
    const alert = document.createElement('ion-alert');
    alert.cssClass = 'alert';
    alert.header = title;
    alert.subHeader = sub;
    alert.message = msg;
    alert.buttons= [
      {
	      text: "OK",
        role : 'cancel',
	    }
	  ],
    document.body.appendChild(alert);
    await alert.present();
    await alert.onDidDismiss().then(()=>{
    });
  }
  
  DateFormatter = {
    monthNames: [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    formatDate: function (date, format) {
      var self = this;
      format = self.getProperDigits(format, /d+/gi, date.getDate());
      format = self.getProperDigits(format, /M+/g, date.getMonth() + 1);
      format = format.replace(/y+/gi, function (y) {
        var len = y.length;
        var year = date.getFullYear();
        if (len == 2)
          return (year + "").slice(-2);
        else if (len == 4)
          return year;
        return y;
      })
      format = self.getProperDigits(format, /H+/g, date.getHours());
      format = self.getProperDigits(format, /h+/g, self.getHours12(date.getHours()));
      format = self.getProperDigits(format, /m+/g, date.getMinutes());
      format = self.getProperDigits(format, /s+/gi, date.getSeconds());
      format = format.replace(/a/ig, function (a) {
        var amPm = self.getAmPm(date.getHours())
        if (a === 'A')
          return amPm.toUpperCase();
        return amPm;
      })
      format = self.getFullOr3Letters(format, /d+/gi, self.dayNames, date.getDay())
      format = self.getFullOr3Letters(format, /M+/g, self.monthNames, date.getMonth())
      return format;
    },
    getProperDigits: function (format, regex, value) {
      return format.replace(regex, function (m) {
        var length = m.length;
        if (length == 1)
          return value;
        else if (length == 2)
          return ('0' + value).slice(-2);
        return m;
      })
    },
    getHours12: function (hours) {return (hours + 24) % 12 || 12;},
    getAmPm: function (hours) {return hours >= 12 ? 'pm' : 'am';},
    getFullOr3Letters: function (format, regex, nameArray, value) {
      return format.replace(regex, function (s) {
        var len = s.length;
        if (len == 3)
          return nameArray[value].substr(0, 3);
        else if (len == 4)
          return nameArray[value];
        return s;
      })
    }
  }

  datetime(){
    const d = new Date() // 26.3.2020
    const dtfUK = new Intl.DateTimeFormat('UK', { year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit',minute: '2-digit', second: '2-digit' }); //
    const dtfUS = new Intl.DateTimeFormat('en', { year: 'numeric', month: '2-digit', day: '2-digit',
            hour: '2-digit',minute: '2-digit', second: '2-digit' }); //
    console.log(dtfUS.format(d)); // 08/05/2010 11:45:00 PM
    console.log(dtfUK.format(d)); // 05.08.2010 23:45:00
  }

  login1(payload:any){
    // let url = "https://live.api.app.nammaflix.in/nammaflix/app/user/login/userName?mobile=8008934466&password=123456"
    let url="https://live.api.app.nammaflix.in/nammaflix/app/user/mobile/login/password"
    var body = {name:"somename", password:"somepass"}
    return this.http.post(url,body);
  }
  
 }
