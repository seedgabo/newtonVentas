import { Printer } from '@ionic-native/printer';
import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController } from 'ionic-angular';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  total;
  first_date = moment().add(10, 'year');
  last_date = moment().subtract(10, 'year');
  invoices = [];
  loading = true;
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionsheet: ActionSheetController, public printer: Printer, public api: Api) {
  }

  ionViewDidLoad() {
    this.calculate();
  }

  calculate() {
    var invoices
    if (this.invoices.length > 0) {
      invoices = this.invoices;
    }
    else {
      invoices = this.api.invoices
    }
    var total = 0;
    this.first_date = moment().add(10, 'year');
    this.last_date = moment().subtract(10, 'year');
    invoices.forEach((inv) => {
      if (inv.total)
        total += inv.total;
      if (moment(inv.created_at) < this.first_date) {
        this.first_date = moment(inv.created_at)
      }
      if (moment(inv.created_at) > this.last_date) {
        this.first_date = moment(inv.created_at)
      }
    })
    this.total = total;
    this.loading = false;
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
    this.invoices = [];
    this.api.storage.set('invoices', []);
    this.calculate();
  }


  findByDate(date) {
    this.loading = true;
    var start = moment(date).format("Y-m-d H:m:s")
    var end = moment(date).add(1, 'day').format("Y-m-d H:m:s")
    this.api.get(`invoices?where[entidad_id]=${this.api.user.entidad_id}&user_id=${this.api.user.id}&whereDategte[created_at]=${start}&whereDatelwe[created_at]=${end}&with[]=cliente&with[]=items`)
      .then((data: any) => {
        this.invoices = data;
        this.calculate();
      })
      .catch(console.error)
  }

  clearByDate() {
    this.api.invoices = [];
  }

}
