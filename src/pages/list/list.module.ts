import { ListPage } from './list';
import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MomentModule } from 'angular2-moment';
import { NgMathPipesModule } from 'angular-pipes';
@NgModule({
  declarations: [
    ListPage,
  ],
  imports: [
    IonicPageModule.forChild(ListPage),
    MomentModule,
    NgMathPipesModule

  ],
})
export class ListPageModule { }
