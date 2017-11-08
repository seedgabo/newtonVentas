import { PrintInvoicePage } from './../print-invoice/print-invoice';
import { Api } from './../../providers/Api';
import { ClienteSearchPage } from './../cliente-search/cliente-search';
import { ProductSearchPage } from './../product-search/product-search';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController } from 'ionic-angular';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items = [];
  cliente = null;
  loading = false;
  constructor(public navCtrl: NavController, public modal: ModalController, public api: Api, public loading: LoadingController, public alert: AlertController, public toast: ToastController) {

  }
  ionViewDidLoad() {
    this.api.get('getParameters')
      .then((resp) => {
        this.api.settings = resp;
        this.api.storage.set('settings', resp);
      })
      .catch(console.error)
    this.loadItems();
  }
  loadItems() {
    this.loading = true;
    this.api.get('productos?where[entidad_id]=' + this.api.user.entidad_id)
      .then((data: any) => {
        console.log(data)
        this.api.productos = data;
        this.loading = false;
      })
      .catch((err) => {
        console.error(err)
        this.loading = false;
      })
  }

  selectProduct() {
    var modal = this.modal.create(ProductSearchPage, );
    modal.present()
    modal.onDidDismiss((data) => {
      if (data) {
        console.log(data);
        data.quantity = 1;
        this.items[this.items.length] = data;
      }
    })
  }

  selectCliente() {
    var modal = this.modal.create(ClienteSearchPage, );
    modal.present()
    modal.onDidDismiss((data) => {
      console.log(data);
      this.cliente = data;
    })
  }

  addOne(item) {
    item.quantity++;
  }

  removeOne(item) {
    if (item.quantity > 1)
      item.quantity--;
  }

  removeItem(index) {
    this.items.splice(index, 1);
  }

  total() {
    var total = 0;
    this.items.forEach((item) => {
      total += item.precio * item.quantity;
    });
    return total;
  }

  proccess() {
    var data = {
      user_id: this.api.user.id,
      cliente_id: this.cliente.id,
      items: [],
      estado: 'Pagado',
      vendedor_id: this.api.user.id,
    }
    this.items.forEach((item) => {
      data.items.push({
        producto_id: item.id,
        precio: item.precio,
        cantidad_pedidos: item.quantity,
        name: item.name,
        referencia: item.referencia,
        image_id: item.image_id,
        iva: item.iva,
        descuento: 0,
      })
    })

    var loading = this.loading.create({
      content: `
            <div class="loader">
                <img src="${this.api.url + "img/logo.png"}"/>
            </div>
            Procesando Pedido`,
      spinner: 'hide'
    })
    loading.present();

    this.api.post("pedidos", data)
      .then((resp) => {
        this.saveData(resp, this.cliente);
        this.toPrint(resp);
        loading.dismiss().then(() => {
          this.items = [];
          this.cliente = null;
          this.toast.create({ message: "Pedido Procesado", duration: 3000 }).present();
        });
      })
      .catch((err) => {
        loading.dismiss().then(() => {
          this.alert.create({ title: "Error", message: JSON.stringify(err), buttons: ["Ok"] }).present();
        });
      });
  }

  toPrint(data) {
    this.api.get('invoices/' + data.invoice_id + "&with[]=cliente&with[]=items")
      .then((resp: any) => {
        console.log("invoice:", resp);
        resp.items = JSON.parse(resp.items);
        this.navCtrl.push("PrintInvoicePage", { invoice: resp });
      })
  }

  canProccess() {
    return this.cliente && this.items.length > 0;
  }

  saveData(invoice, cliente) {
    invoice.cliente = cliente;
    this.api.invoices.push(invoice);
    this.api.storage.set('invoices', this.api.invoices);
  }

}
