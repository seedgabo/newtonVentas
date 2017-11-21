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
  items = [];
  propina = 0;
  iva = 0;
  impoconsumo = 0;
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
      this.prepare();
      // this.print(this.invoice);
    }
  }
  print(invoice, receipt = null) {
    setTimeout(() => {
      if (!this.platform.is('mobile')) {
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

  prepare() {
    this.invoice.items.forEach(item => {
      if (item.referencia == 'Propina') {
        this.propina = item.total;
      } else {
        this.items.push(item);
      }
    });
    this.total();
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
    var iva = 0;
    var impoconsumo = 0;
    items.forEach((item) => {
      total += item.total;
      if (item.impuesto == 19) {
        iva += item.precio * 19 / 100;
      }
      if (item.impuesto == 8) {
        impoconsumo += item.precio * 8 / 100;
      }
    });
    this.impoconsumo = impoconsumo;
    this.iva = iva;
    return total;
  }
}
