import { Printer } from '@ionic-native/printer';
import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  total;
  constructor(public navCtrl: NavController, public navParams: NavParams, public printer: Printer, public api: Api) {
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

  print(invoice, receipt = null) {
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
