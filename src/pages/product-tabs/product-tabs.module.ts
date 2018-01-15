import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProductTabsPage } from './product-tabs';

@NgModule({
  declarations: [
    ProductTabsPage,
  ],
  imports: [
    IonicPageModule.forChild(ProductTabsPage),
  ]
})
export class ProductTabsPageModule {}
