import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SparesPageRoutingModule } from './spares-routing.module';

import { SparesPage } from './spares.page';
import { SharedModule } from '../services/sharedModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SparesPageRoutingModule,
    SharedModule
  ],
  declarations: [SparesPage]
})
export class SparesPageModule {}
