import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../services/data.service';

@Component({
  selector: 'app-spares',
  templateUrl: './spares.page.html',
  styleUrls: ['./spares.page.scss'],
})
export class SparesPage implements OnInit {
  showLoader = false;
  sparesData:any;
  user:any; 
  cols =['itemDescription','itemTrackingQty'];
  xx = 'xx';

  
  constructor(
    private router:Router,
    private dataservice: DataService
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.user = this.dataservice.getEncrData('user');
    this.getSparesData();
  }
  getSparesData(){
    this.showLoader =true;
    let user = this.dataservice.getEncrData('user');
    this.dataservice.getSparesDetails({fieldRepId: user.id}).subscribe((res:any)=>{
      console.log(res)
      if(res.status !="Failed"){
        var arr = res.data;
        const sortAlphaNum = (a:any, b:any) => a.status.localeCompare(b.status, 'en', { numeric: true })
        arr.sort(sortAlphaNum);
        this.showLoader =false;
        this.sparesData = arr;
      }else{
        this.showLoader =false;
        this.sparesData = [];
      }
    })
  }
  submitSpare(spare:any, e:any){

    if(spare.status == 'PushedToFR'){
      spare.frInHandQty = (e.target.parentElement.previousElementSibling.previousElementSibling.children[0].value)
      spare.frUsedQty = (e.target.parentElement.previousElementSibling.children[0].value)
      if(spare.frInHandQty != '' && spare.frUsedQty != ''){
             // var fyyf = ['ApprovedByLead', 'InitialLoad', 'PushedToFR','Rejected','SubmittedByFR'];
      spare.status = "SubmittedByFR";
      var day =  (this.dataservice.DateFormatter.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss')); 
      spare.submittedTime = day;
      // spare.diffInQty = spare.itemTrackingQty - (spare.frInHandQty + spare.frUsedQty);
      spare.submittedBy = this.user.id;
      this.showLoader =true;
      this.dataservice.updateSparesDetails(spare).subscribe((res:any)=>{
        console.log(res)
        this.showLoader =false;
        this.dataservice.presentAlert(`${res.status} !`, res.Message, `Request Successful.`)
      });
      }else{
        this.dataservice.presentAlert('Warning !', 'Fields cannot be empty. Please enter data to submit.', `Request cannot be submitted for ${spare.itemDescription}.`)
      }
    }else{
      this.dataservice.presentAlert('Warning !', 'Data has already been registered. Please contact administartion in case of any discrepancy.', `Request cannot be submitted for ${spare.itemDescription}.`)
    }
  }
  logout(){
    localStorage.removeItem("user");
    this.router.navigateByUrl('/login'); 
  }
  gotoNewSpare(){
    this.router.navigateByUrl('spares/add-spares'); 
  }



}

