import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '', redirectTo: '/login', pathMatch: 'full'},
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'location',
    loadChildren: () => import('./services/location/location.module').then( m => m.LocationPageModule)
  },
  {
    path: 'tracking',
    loadChildren: () => import('./tracking/tracking.module').then( m => m.TrackingPageModule)
  },  {
    path: 'spares',
    loadChildren: () => import('./spares/spares.module').then( m => m.SparesPageModule)
  }


];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
