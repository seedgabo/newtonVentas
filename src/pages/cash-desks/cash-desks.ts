import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ActionSheetController } from 'ionic-angular';
import * as moment from 'moment'
moment.locale('es')
@IonicPage()
@Component({
  selector: 'page-cash-desks',
  templateUrl: 'cash-desks.html',
})
export class CashDesksPage {
  cashdesks = [];
  constructor(public navCtrl: NavController, public navParams: NavParams,public actionsheet:ActionSheetController,public api:Api) {
  }

  ionViewDidLoad() {
    this.getCashDesks();
  }

  getCashDesks(){
    this.api.get(`cash_desks?order[from]=desc&where[user_id]=${this.api.user.id}&with[]=invoices`)
    .then((data:any)=>{
      console.log(data)
      this.cashdesks = data
    })
    .catch((err)=>{
        console.log(err)
    })
  }

  actions(cashdesk){
    var sheet = this.actionsheet.create({
        title: "Acciones",
        buttons:[
          {
            text: "Imprimir",
            icon: "print",
            handler: ()=>{
              this.printCashDesk(cashdesk)
            }
          },
          {
            text: "Cancelar",
            icon: "close",
            role: 'cancel'
          }
        ]
    }).present()
  }

  printCashDesk(cashdesk){
    this.navCtrl.push("CashDesk", {
      cashdesk: cashdesk
    })
  }

}
