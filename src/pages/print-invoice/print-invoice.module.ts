// import { PipesModule } from './../../pipes/pipes.module';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PrintInvoicePage } from './print-invoice';
import { MomentModule } from 'angular2-moment';
import { NgMathPipesModule } from 'angular-pipes';
@NgModule({
  declarations: [
    PrintInvoicePage,
  ],
  imports: [
    MomentModule,
    IonicPageModule.forChild(PrintInvoicePage),
    NgMathPipesModule,
    // PipesModule
  ],
})
export class PrintInvoicePageModule { }
