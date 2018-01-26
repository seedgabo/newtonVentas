import { MomentModule } from 'angular2-moment';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashDeskPage } from './cash-desk';

@NgModule({
  declarations: [
    CashDeskPage,
  ],
  imports: [
    IonicPageModule.forChild(CashDeskPage),
    MomentModule
  ],
})
export class CashDeskPageModule {}
