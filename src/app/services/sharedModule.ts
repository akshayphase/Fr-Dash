import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AlertComponent } from './alertservice/alert/alert.component';
import { LoaderComponent } from './loader/loader.component';


@NgModule({
 imports:      [ CommonModule ],
 declarations: [ LoaderComponent, AlertComponent ],
 exports:      [ LoaderComponent, AlertComponent, CommonModule ]
})
export class SharedModule { }