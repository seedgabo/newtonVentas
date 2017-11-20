import { Printer } from '@ionic-native/printer';
import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams, IonicPage, ActionSheetController, Platform } from 'ionic-angular';
import * as moment from 'moment';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
moment.locale("es");
@IonicPage()
@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {
  total;
  first_date
  last_date
  invoices = [];
  loading = true;
  from
  to
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionsheet: ActionSheetController, public platform: Platform, public printer: Printer, public popover: PopoverController, public api: Api) {
  }

  ionViewDidLoad() {
    this.from = null;
    this.to = null;
    this.invoices = this.api.invoices;
    this.calculate();
  }

  calculate() {
    var total = 0;
    if (this.invoices.length > 0) {
      this.first_date = moment(this.invoices[0].created_at)
      this.last_date = moment(this.invoices[this.invoices.length - 1].created_at)
    }
    this.invoices.forEach((inv) => {
      total += inv.total;
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
      if (this.platform.is('browser')) {
        return this.toPrintCallback();
      };
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


  findByDate(date, to = null) {
    this.loading = true;
    var start = this.from = moment(date).format("YYYY-MM-DD h:mm:ss")
    var end = this.to = (to ? to : moment(date).add(1, 'day').format("YYYY-MM-DD h:mm:ss"))
    // this.api.get(`invoices?where[entidad_id]=${this.api.user.entidad_id}&where[user_id]=${this.api.user.id}&whereDategte[created_at]=${start}&whereDatelwe[created_at]=${end}&with[]=cliente`)
    this.api.get(`invoices?where[user_id]=${this.api.user.id}&whereDategte[created_at]=${start}&whereDatelwe[created_at]=${end}&with[]=cliente`)
      .then((data: any) => {
        console.log(data);
        this.invoices = data;
        this.calculate();
      })
      .catch(console.error)
  }

  clearByDate() {
    this.ionViewDidLoad()
  }


  more(ev) {
    let popover = this.popover.create("PopoverListPage", {
      search: this.findByDate,
      clear: this.clearByDate
    })
    popover.present({ ev: ev });
    popover.onWillDismiss((data) => {
      if (!data) return
      if (data.action == 'search')
        this.findByDate(data.from, data.to);
      if (data.action == 'clear')
        this.clearByDate();

    })
  }

}
