import { Injectable } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

 
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(private router: Router) {
    // clear alert message on route change
    router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
         this.subject.next("");
        }
      }
    });
  }

  success(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'success', text: message });
  }

  error(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'error', text: message });
  }

  warning(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'warning', text: message });
  }

  info(message: string, keepAfterNavigationChange = false) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({ type: 'info', text: message });
  }

  clearAlertMessage() {
    this.subject.next("");
  }
  getMessage(): Observable<any> {   
    return this.subject.asObservable();
  }

}
/*

css for alert component

.alert{padding:.85rem 1.5rem;border-radius:4px;background:#fff;position:relative;
    margin-bottom:1rem;border:1px solid transparent}
.alert-danger{color:#fff;background-color:#f66e84;border-color:#f55f78}
.alert-success{color:#fff;background-color:#45ccb1;border-color:#39c9ac}
.alert-warning{color:#fff;background-color:#ffc241;border-color:#ffbd31}
.alert-info{color:#31708f;background-color:#d9edf7;border-color:#bce8f1}


html for alert comopnent

<div *ngIf="message" [ngClass]="{ 'alert': message, 'alert-success': message.type === 'success', 
'alert-danger': message.type === 'error', 'alert-warning': message.type === 'warning', 
'alert-info': message.type === 'info' }"
    >
    {{message.text}}
    <span (click)="closeMessage()" style="float:right;cursor: pointer;">
        <i class="fa fa-times" style="font-size:14px"></i></span>
</div>


script file of alert component

import { Component, OnInit } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
import { AlertService } from '../alert.service';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  private subscription: Subscription;
  message: any;
  private timer: Observable<any>;

  constructor(private alertService: AlertService) {
    // subscribe to alert messages
    this.subscription = alertService.getMessage().subscribe(message => {
      this.message = message;
    });
  }
  ngOnInit() {    
  }
  ngOnDestroy(): void {
    // unsubscribe on destroy to prevent memory leaks
    this.subscription.unsubscribe();
  }
  closeMessage() {
    this.alertService.clearAlertMessage();    
  } 
}



how to use:::

use in component like this

<div style="text-align:center">
  <h2>Click for getting alert message</h2>
  <app-alert></app-alert>
</div>
<ul style="margin-top:10%;margin-left:30%">
  <li>
    <h2>
      <button class="btn btn-success" (click)="getSuccessMessage()">Success</button>
    </h2>
  </li>
    <li>
    <h2>
      <button class="btn btn-warning" (click)="getWarningMessage()">Warning</button>
    </h2>
  </li>
</ul>

script

constructor(private alertService: AlertService) { }
  getSuccessMessage() {
    this.alertService.success("Yeah !!!! You got message successfully");
  }
  getWarningMessage() {
    this.alertService.warning("Oh !!!! Plz check double");
  }
  
this.alertService.success("Yeah !!!! You got message successfully");
this.alertService.warning("Oh !!!! Plz check double");
this.alertService.error("Ooopss !!!! Something went wrong");
this.alertService.info("Yepp !!! This is a important information");
this.alertService.clearAlertMessage();

*/