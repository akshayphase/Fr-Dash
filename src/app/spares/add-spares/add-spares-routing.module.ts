import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddSparesPage } from './add-spares.page';

const routes: Routes = [
  {
    path: '',
    component: AddSparesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddSparesPageRoutingModule {}
