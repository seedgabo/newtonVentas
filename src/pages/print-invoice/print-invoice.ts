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
  subtotal = 0;
  pagos = null
  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public api: Api, public printer: Printer) {
    this.invoice = navParams.get('invoice');
    this.receipt = navParams.get('receipt');
    if (navParams.get('user')) {
      this.invoice.user = navParams.get('user');
    }
    if (navParams.get('receipt')) {
      this.invoice.receipt = navParams.get('receipt');
    }

    moment.locale('es');
  }

  ionViewDidLoad() {
    if (this.navParams.get('print') === undefined || this.navParams.get('print')) {
      this.prepare();
      this.print(this.invoice);
    }
  }
  print(invoice, receipt = null) {
    setTimeout(() => {
      if (!this.platform.is('mobile')) {
        return this.toPrintCallback(invoice);
      };
      var promise;
      if (this.api.settings_invoices.tipo_impresion == "pos") {
        promise = this.printer.print(document.getElementById('toPrintMini'), { name: 'invoice' })

      } else {
        promise = this.printer.print(document.getElementById('toPrint'), { name: 'invoice' })
      }
      promise.then(() => {
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
    if (this.isJson(this.invoice.pago)) {
      this.pagos = JSON.parse(this.invoice.pago);
    }
    console.log(this.invoice);
    console.log(this.pagos);
  }

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
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
    var subtotal = 0;
    items.forEach((item) => {
      total += item.total;
      if (item.referencia != 'Propina') {
        subtotal += item.precio * item.cantidad;
      }
      if (item.impuesto == 19) {
        iva += item.precio * 19 / 100;
      }
      if (item.impuesto == 8) {
        impoconsumo += item.precio * 8 / 100;
      }
    });
    this.impoconsumo = impoconsumo;
    this.iva = iva;
    this.subtotal = subtotal;
    return total;
  }
}
