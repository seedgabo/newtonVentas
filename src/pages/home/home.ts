import { Api } from './../../providers/Api';
import { ClienteSearchPage } from './../cliente-search/cliente-search';
import { ProductSearchPage } from './../product-search/product-search';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController, IonicPage } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  items = [];
  cliente = null;
  loading = false;
  default_cliente: any = {
    'id': 99,
    'nombres': 'No Definido',
    'appellidos': '',
    'nit': 'No Posee'
  }
  constructor(public navCtrl: NavController, public modal: ModalController, public api: Api, public loadingctrl: LoadingController, public alert: AlertController, public toast: ToastController) {

  }
  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.api.get('getParameters')
        .then((resp) => {
          this.api.settings = resp;
          this.api.storage.set('settings', resp);
        })
        .catch(console.error)
      this.loadItems();
      this.api.get('clientes/99').then((data) => {
        this.default_cliente = data;
      })
        .catch(console.error)
    })
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

  askPago() {
    this.alert.create({
      title: 'Forma de Pago',
      subTitle: 'Seleccione',
      inputs: [{
        type: 'radio',
        label: 'Efectivo',
        value: 'efectivo',
        checked: true
      },
      {
        type: 'radio',
        label: 'Tarjeta de Débito',
        value: 'Tarjeta de Débito',
        checked: false
      },
      {
        type: 'radio',
        label: 'Tarjeta de Crédito',
        value: 'Tarjeta de Crédito',
        checked: false
      },
      {
        type: 'radio',
        label: 'Otros',
        value: 'Otros',
        checked: false
      }],
      buttons: [{
        text: 'cancelar',
        role: 'cancel',
        handler: () => {

        }
      }, {
        text: 'Facturar',
        role: 'process',
        handler: (data) => {
          this.proccess(data);
        }
      }]
    }).present();
  }

  proccess(metodo) {
    var data: any = {
      user_id: this.api.user.id,
      entidad_id: this.api.user.entidad_id,
      cliente_id: this.cliente ? this.cliente.id : this.default_cliente.id,
      items: [],
      estado: 'Pagado',
      pago: metodo,
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

    var loading = this.loadingctrl.create({
      content: `
            <div class="loader">
                <img src="${this.api.url + "img/logo.png"}"/>
            </div>
            Procesando Pedido`,
      spinner: 'hide'
    })
    loading.present();
    this.getNumeroPedido()
      .then((number: number) => {
        data.numero_pedido = number + 1;
        this.api.post("pedidos", data)
          .then((resp) => {
            this.saveData(resp, this.cliente ? this.cliente : this.default_cliente);
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
      })
      .catch((err) => {
        loading.dismiss().then(() => {
          this.alert.create({ title: "Error", message: JSON.stringify(err), buttons: ["Ok"] }).present();
        });
      })
  }

  getNumeroPedido() {
    return new Promise((resolve, reject) => {
      this.api.get(`pedidos?where[entidad_id]=${this.api.user.entidad_id}&count=1`)
        .then(resolve)
        .catch(reject)
    })
  }


  toPrint(data) {
    this.api.get('invoices/' + data.invoice_id + "?with[]=cliente&with[]=items")
      .then((resp: any) => {
        console.log("invoice:", resp);
        resp.items = JSON.parse(resp.items);
        this.navCtrl.push("PrintInvoicePage", { invoice: resp });
      })
  }

  canProccess() {
    return this.items.length > 0;
  }

  saveData(invoice, cliente) {
    invoice.cliente = cliente;
    this.api.invoices.push(invoice);
    this.api.storage.set('invoices', this.api.invoices);
  }

}
