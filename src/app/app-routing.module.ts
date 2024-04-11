import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SvgMapComponent } from './svg-map/svg-map.component';

const routes: Routes = [
  {path: '', component: SvgMapComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
