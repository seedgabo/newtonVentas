import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CashDesksPage } from './cash-desks';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    CashDesksPage,
  ],
  imports: [
    IonicPageModule.forChild(CashDesksPage),
    MomentModule,
  ],
})
export class CashDesksPageModule {}
