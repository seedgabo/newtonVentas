// import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintInvoicePage } from './print-invoice';
import { MomentModule } from 'angular2-moment';

@NgModule({
  declarations: [
    PrintInvoicePage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(PrintInvoicePage),
    // PipesModule
  ],
})
export class PrintInvoicePageModule { }
