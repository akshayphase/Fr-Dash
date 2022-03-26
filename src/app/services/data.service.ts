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


  constructor(private http: HttpClient) { }

  // baseurl2 = "http://smstaging.iviscloud.net:8090/frdashboard/";
  // baseurl1 = "http://localhost:8080/frdashboard/";
  baseurl = "http://10.0.2.192:8080/frdashboard/";


  login(payload:any){
    let url =this.baseurl+"login";
    return  this.http.post(url,payload, this.requestOptions);
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

}
