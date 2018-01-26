import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import * as moment from 'moment';
@IonicPage()
@Component({
  selector: 'page-cash-desk',
  templateUrl: 'cash-desk.html',
})
export class CashDeskPage {
  invoices = []
  products = {}
  categories = {
    "0": {
      total: 0,
      quantity: 0,
      _category: {
        name: '---'
      }
    }
  }
  sums = {}
  counts = {}
  printing = true;
  from;
  to;
  total = 0;
  total_receipts = 0;
  close = false;
  user;
  entidad
  cash_desk = null;
  show_products = true;
  show_categories = false;
  loading = false
  constructor(public api:Api,public navCtrl: NavController, public navParams: NavParams) {
    if (this.navParams.get('cashdesk')) {
      this.cash_desk = this.navParams.get('cashdesk');
    }

    if (this.navParams.get('invoices'))
      this.invoices = this.navParams.get('invoices');
    else
      this.invoices = this.cash_desk.invoices

    if (this.navParams.get('print') !== undefined) {
      this.printing = this.navParams.get('print');
    }

    if (this.navParams.get('show_categories') !== undefined) {
      this.show_categories = this.navParams.get('show_categories');
    }

    if (this.navParams.get('show_products') !== undefined) {
      this.show_products = this.navParams.get('show_products');
    }

    if (this.navParams.get('user'))
      this.user = this.navParams.get('user');
    else
      this.user = this.api.user;
  }

  ionViewDidLoad() {
    this.calculate()
    if (this.show_categories) {
      this.calculateCategories()
    }
  }

  calculate() {
    this.products = {}
    this.sums = {}
    this.total = 0
    if (this.invoices.length > 0) {
      this.from = moment(this.invoices[0].created_at)
      this.to = moment(this.invoices[this.invoices.length - 1].created_at)
    }

    this.invoices.forEach((inv) => {
      if (inv.estado != 'anulado') {
        inv.items.forEach(item => {
          if (!this.products[item.name]) {
            this.products[item.name] = {
              quantity: Number(item.quantity),
              amount: Number(item.amount),
              _product: item
            };
          } else {
            this.products[item.name].quantity += Number(item.quantity);
          }
        });
        this.total += Number(inv.total);
        this.getPaymentsFromInvoices(inv);
      }
    })
  }

  calculateCategories() {
    this.loading = true
    Object.keys(this.products).forEach((key) => {
      var prod = this.products[key]._product
      var category_id = prod.category_id
      if (category_id == null) {
        this.categories["0"].total += Number(prod.quantity * prod.amount);
        this.categories["0"].quantity += Number(prod.quantity);
      }
      else if (!this.categories[category_id]) {
        this.categories[category_id] = {
          total: Number(prod.quantity * prod.amount),
          quantity: Number(prod.quantity),
        };
      } else {
        this.categories[category_id].total += Number(prod.quantity * prod.amount);
        this.categories[category_id].quantity += Number(prod.quantity);
      }

    })
    this.api.get('categorias-productos')
      .then((categories: any) => {
        Object.keys(this.categories).forEach((i) => {
          if (categories.collection[i]) {
            this.categories[i]._category = categories.collection[i]
          }
        })
        console.log(this.categories)
        this.loading = false
      })
      .catch((err) => {
        this.loading = false
      })
  }

  print() {
    window.print()
  }

  getPaymentsFromInvoices(invoice) {
    var payment = invoice.payment
    if (!payment) {
      this.addTosums("cash", invoice.total)
      return;
    }
    if (this.isJson(payment)) {
      JSON
        .parse(payment)
        .forEach(pay => {
          this.addTosums(pay.method, pay.amount)
        });
    } else {

      this.addTosums(payment, invoice.total)
    }
  }

  isJson(str) {
    try {
      JSON.parse(str);
    } catch (error) {
      return false
    }
    return true;
  }

  addTosums(method, amount) {
    if (!this.sums[method]) {
      this.sums[method] = Number(amount);
      this.counts[method] = 1
    } else {
      this.sums[method] += Number(amount);
      this.counts[method]++
    }
  }

  keys(obj){
    var array = []
    Object.keys(obj).forEach((key)=>{
       array[array.length] = { key: key, value: obj[key]}
    })
    return array;
  }
}
