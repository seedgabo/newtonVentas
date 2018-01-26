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
  printing = false;
  totals = {
    "Efectivo": 0,
    "Tarjeta de Debito": 0,
    "Tarjeta de Credito": 0,
    "Otro": 0,
  }
  cash_desk = null
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionsheet: ActionSheetController, public platform: Platform, public printer: Printer, public popover: PopoverController, public api: Api) {

  }

  ionViewDidLoad() {
    console.log(this.api.invoices)
    this.api.ready.then(() => {
      this.from = null;
      this.to = null;
      this.invoices = this.api.invoices;
      this.calculate();
      console.log(this.totals);
    })
  }

  calculate() {
    var total = 0;
    this.totals = {
      "Efectivo": 0,
      "Tarjeta de Debito": 0,
      "Tarjeta de Credito": 0,
      "Otro": 0,
    }
    if (this.invoices.length > 0) {
      this.first_date = moment(this.invoices[0].created_at)
      this.last_date = moment(this.invoices[this.invoices.length - 1].created_at)
    }
    this.invoices.forEach((inv) => {
      total += inv.total;
      if (this.isJson(inv.pago)) {
        JSON.parse(inv.pago).forEach(element => {
          this.addToTotals(element.metodo, element.monto)
        });
      } else {
        this.addToTotals(inv.pago, inv.total);
      }
    })
    this.total = total;
    this.loading = false;
  }

  addToTotals(type, amount) {
    this.totals[type] += Number(amount);
  }

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
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
    var id = data.invoice_id;
    if (!id) {
      id = data.id;
    }

    this.api.get('invoices/' + id + "?with[]=cliente&with[]=items&with[]=user")
      .then((resp: any) => {
        console.log("invoice:", resp);
        resp.items = JSON.parse(resp.items);
        this.navCtrl.push("PrintInvoicePage", { invoice: resp });
      })
      .catch((err) => {
        this.navCtrl.push("PrintInvoicePage", { invoice: data });
      })
  }

  proccess() {
    this.loading = true
    var data = {
      user_id: this.api.user.id,
      from: this.first_date.format('Y-M-D H:mm:ss'),
      to: this.last_date.format('Y-M-D H:mm:ss'),
      invoices: []
    }
    this.invoices.forEach((inv) => {
      data.invoices.push(inv.invoice_id)
    })
    this.api.post('cash_desks', data).then((resp) => {
      console.log(resp)
      this.cash_desk = resp;
      this.loading = false
      setTimeout(() => {
        this.print(true);
      }, 120)
    })
    .catch((err) => { 
        this.loading = false
        console.error(err) 
      })
  }

  print(clear = true) {
    this.navCtrl.push("CashDeskPage", {cashdesk : this.cash_desk})
    setTimeout(() => {        
      if (clear) this.complete();
    }, 1000);
  }


  complete() {
    this.clear();
  }

  clear() {
    this.cash_desk = null
    this.api.invoices = [];
    this.invoices = [];
    this.api.storage.set('invoices', []);
    this.calculate();
  }


  findByDate(date, to = null, only_user = true) {
    this.loading = true;
    var start = moment(date).format("YYYY-MM-DD")
    var end = (to ? moment(to).add(1, 'day').format('YYYY-MM-DD') : moment(date).add(1, 'day').format("YYYY-MM-DD"))
    this.api.get(`invoices?where[entidad_id]=${this.api.user.entidad_id}&${only_user ? 'where[user_id]=' + this.api.user.id : ''}&whereDategte[created_at]=${start}&whereDatelwe[created_at]=${end}&with[]=cliente`)
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
      from: this.from,
      to: this.to
    })
    popover.present({ ev: ev });

    popover.onWillDismiss((data) => {
      if (!data) return
      if (data.action == 'search')
        this.findByDate(data.from, data.to, data.only_user);
      if (data.action == 'clear')
        this.clearByDate();

      this.from = data.from
      this.to = data.to
    })
  }

}
