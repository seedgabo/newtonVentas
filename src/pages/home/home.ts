import { Api } from './../../providers/Api';
import { ClienteSearchPage } from './../cliente-search/cliente-search';
import { ProductSearchPage } from './../product-search/product-search';
import { Component } from '@angular/core';
import { NavController, ModalController, LoadingController, AlertController, ToastController, IonicPage } from 'ionic-angular';
import { ActionSheetController } from 'ionic-angular/components/action-sheet/action-sheet-controller';
import { PopoverController } from 'ionic-angular/components/popover/popover-controller';
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
  propina = null;
  descuento = 0;
  constructor(public navCtrl: NavController, public modal: ModalController, public api: Api, public loadingctrl: LoadingController, public popover: PopoverController, public alert: AlertController, public toast: ToastController, public actionsheet: ActionSheetController) {

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
      total += item.precio * item.quantity + (item.precio * item.quantity * item.impuesto / 100);
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
        label: 'Otro',
        value: 'Otro',
        checked: false
      },
      {
        type: 'radio',
        label: 'detallado',
        value: 'detallado',
        checked: false,
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
          if (data == 'detallado') {
            var popover = this.popover.create("PagosPage", { total: this.total() })
            popover.present();
            popover.onDidDismiss((pagos, role) => {
              if (role != 'accept') {
                return;
              }
              this.proccess(JSON.stringify(pagos));
            })
            return
          }

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
        impuesto: item.impuesto,
        descuento: this.calculateDescuento(item),
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
              this.propina = null
              this.descuento = 0;
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

  calculateDescuento(item) {
    return 0;
    // var total = (item.precio * item.quantity * (1 + item.impuesto / 100));
    // return total * this.descuento;
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

  actions() {
    this.actionsheet.create({
      title: "Acciones",
      buttons: [{
        text: 'Agregar Propina',
        icon: 'cash',
        handler: () => {
          this.agregarPropina();
        }
      }, {
        text: 'Cancelar',
        role: 'cancel',
        icon: 'close',
      }]
    }).present();
  }

  agregarPropina() {
    var total = this.total() * 0.1;
    this.alert.create({
      'title': 'Valor de la propina',
      inputs: [{
        label: 'Valor de la propina',
        placeholder: 'Valor',
        value: "" + total,
        type: 'number',
        name: 'propina'
      }],
      buttons: [{
        text: 'Cancelar'
      }, {
        text: 'Agregar',
        handler: (data) => {
          if (data && data.propina)
            this.items.push({
              id: null,
              image_id: null,
              name: 'Propina',
              referencia: 'Propina',
              precio: data.propina,
              iva: 0,
              impuesto: 0,
              quantity: 1,
            });
        }
      }]
    }).present();
  }

}
