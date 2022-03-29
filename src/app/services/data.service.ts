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

  
  baseurl = "http://smstaging.iviscloud.net:8090/frdashboard/";
  // baseurl = "http://localhost:8080/frdashboard/";
  // baseurl = "http://10.0.2.192:8080/frdashboard/";


  constructor(private http: HttpClient) { }

  login(payload:any){
    let url =this.baseurl+"login";
    // console.log(url,JSON.stringify(payload), JSON.stringify(this.requestOptions));
    return  this.http.post(url,payload,this.requestOptions);
  }

  login1(payload:any){
    // let url = "https://live.api.app.nammaflix.in/nammaflix/app/user/login/userName?mobile=8008934466&password=123456"
    let url="https://live.api.app.nammaflix.in/nammaflix/app/user/mobile/login/password"
    var body = {name:"somename", password:"somepass"}
    return this.http.post(url,body);
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
}
