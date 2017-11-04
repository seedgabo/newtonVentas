import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ClienteEditorPage } from './cliente-editor';

@NgModule({
  declarations: [
    ClienteEditorPage,
  ],
  imports: [
    IonicPageModule.forChild(ClienteEditorPage),
  ],
})
export class ClienteEditorPageModule { }
