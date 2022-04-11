import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-add-spares',
  templateUrl: './add-spares.page.html',
  styleUrls: ['./add-spares.page.scss'],
})
export class AddSparesPage implements OnInit {
  showLoader = false;
  sparesData:any;
  category:any;
  subcategory:any;
  user:any;
  selectedCategory:any;
  selectedItem:any;
  spare={
    dataLoadedDate:'',
    fieldRepId:'',
    frInHandQty:'',
    frUsedQty:'',
    itemCode:'',
    itemDescription:'',
    itemTrackingQty:'',
    pushdate:'',
    remarks:'added by FR',
    status:'new',
    submittedBy:'',
    submittedTime:''
  }
  entermanually=true;

  constructor(
    private router:Router,
    private dataservice: DataService
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter(){
    this.user = this.dataservice.getEncrData('user');
    this.getAddSpareinfo();
  }

  getAddSpareinfo(){
    this.dataservice.getAddSpareDetails().subscribe((res:any)=>{
      console.log(res)
      this.sparesData = (res);
      const cde = Array.from(this.sparesData.reduce((m:any, 
        {Category}:{Category:any} ) => m.set(Category, (m.get(Category) || 0)), 
        new Map), ([Category]) => ({Category}));   
      this.category = cde;
    })
  }
  onSelectChange(selectedValue: any, cat:any) {
    var x  = selectedValue.detail.value
    if(cat == 'cat'){
      this.subcategory = null
      var arr = this.sparesData.filter((el:any) => el.Category == x)
      const cde = Array.from(arr.reduce((m:any, 
        {description}:{description:any} ) => m.set(description, (m.get(description) || 0)), 
        new Map), ([description]) => ({description}));  
      this.subcategory = cde;
    }
    if(cat == 'subcat'){
      this.selectedCategory == x;
    }
  }
  submitSpare(){
    var spare = this.spare;
    let user = this.dataservice.getEncrData('user');
    spare.itemDescription = this.selectedItem;
    if((this.sparesData.filter((el:any) => el.description == this.selectedItem))[0]){
      spare.itemCode = (this.sparesData.filter((el:any) => el.description == this.selectedItem))[0].sapcode;
    }else{
      spare.itemCode = null;
    }
    if(spare.status == 'new'){
      if(spare.frInHandQty != '' && spare.frUsedQty != '' && spare.itemDescription != ''){
      var day =  (this.dataservice.DateFormatter.formatDate(new Date(), 'YYYY-MM-DD HH:mm:ss'));
      spare.submittedTime = day;
      spare.pushdate = day;
      var xyz = Number(spare.frInHandQty) + Number(spare.frUsedQty)
      spare.itemTrackingQty = String(xyz);
      spare.submittedBy = user.id;
      spare.fieldRepId = user.id;
      console.log(spare)
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
