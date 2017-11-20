import { Api } from './../../providers/Api';
import { Printer } from '@ionic-native/printer';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-print-invoice',
  templateUrl: 'print-invoice.html',
})
export class PrintInvoicePage {
  invoice: any = {};
  receipt: any = {};
  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public api: Api, public printer: Printer) {
    this.invoice = navParams.get('invoice');
    this.receipt = navParams.get('receipt');
    if (navParams.get('user')) {
      this.invoice.user = navParams.get('user');
    }
    if (navParams.get('receipt')) {
      this.invoice.receipt = navParams.get('receipt');
    }
    console.log(this.invoice);
    moment.locale('es');
  }

  ionViewDidLoad() {
    if (this.navParams.get('print') === undefined || this.navParams.get('print')) {
      this.print(this.invoice);
    }
  }
  print(invoice, receipt = null) {
    setTimeout(() => {
      if (this.platform.is('browser')) {
        return this.toPrintCallback(invoice);
      };
      this.printer.print(document.getElementById('toPrint'), { name: 'invoice' })
        .then(() => {
          this.complete();
        })
        .catch((err) => {
          this.toPrintCallback(invoice);
          console.error(err);
        });

    }, 1000);
  }

  toPrintCallback(invoice) {
    window.print();
    this.complete();
  }

  complete() {
    this.navCtrl.pop();
  }

  total() {
    var items = this.invoice.items
    var total = 0;
    items.forEach((item) => {
      total += item.total;
    });
    return total;
  }
}
