import { Printer } from '@ionic-native/printer';
import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController } from 'ionic-angular';
import * as moment from 'moment';

moment.locale("es");
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  total;
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionsheet: ActionSheetController, public printer: Printer, public api: Api) {
  }

  ionViewDidLoad() {
    this.calculate();
  }

  calculate() {
    var total = 0;
    this.api.invoices.forEach((inv) => {
      if (inv.total)
        total += inv.total;
    })
    this.total = total;
  }

  actions(invoice) {
    this.actionsheet.create({
      title: 'Acciones',
      buttons: [
        {
          text: 'Ver Factura',
          icon: 'document',
          handler: () => {
            this.printInvoice(invoice);
          }
        },
        {
          text: 'Cancelar',
          role: 'cancel',
          icon: 'close',
        }
      ]
    }).present();
  }

  printInvoice(data) {
    this.api.get('invoices/' + data.invoice_id + "?with[]=cliente&with[]=items")
      .then((resp: any) => {
        console.log("invoice:", resp);
        resp.items = JSON.parse(resp.items);
        this.navCtrl.push("PrintInvoicePage", { invoice: resp });
      })
      .catch((err) => {
        this.navCtrl.push("PrintInvoicePage", { invoice: data });
      })
  }

  print() {
    setTimeout(() => {
      this.printer.print(document.getElementById('toPrint'), { name: 'invoice' })
        .then(() => {
          this.complete();
        })
        .catch((err) => {
          this.toPrintCallback();
          console.error(err);
        });

    }, 1000);
  }

  toPrintCallback() {
    window.print();
    this.complete();
  }

  complete() {
    this.clear();
  }

  clear() {
    this.api.invoices = [];
    this.api.storage.set('invoices', []);
    this.calculate();
  }
}
