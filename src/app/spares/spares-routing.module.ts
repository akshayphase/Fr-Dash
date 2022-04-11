import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SparesPage } from './spares.page';

const routes: Routes = [
  {
    path: '',
    component: SparesPage
  },
  {
    path: 'add-spares',
    loadChildren: () => import('./add-spares/add-spares.module').then( m => m.AddSparesPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SparesPageRoutingModule {}
