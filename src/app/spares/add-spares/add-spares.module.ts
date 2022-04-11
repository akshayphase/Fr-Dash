import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddSparesPageRoutingModule } from './add-spares-routing.module';

import { AddSparesPage } from './add-spares.page';
import { SharedModule } from 'src/app/services/sharedModule';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddSparesPageRoutingModule,
    SharedModule
  ],
  declarations: [AddSparesPage]
})
export class AddSparesPageModule {}
