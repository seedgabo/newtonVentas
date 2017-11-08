import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-producto',
  templateUrl: 'producto.html',
})
export class ProductoPage {
  producto: any = {
    "referencia": "",
    "name": "",
    "description": "",
    "precio": 1,
    "destacado": 0,
    "active": 1,
    "impuesto": 19,
    "discount": 0,
    "es_vendible_sin_stock": 1,
    "mostrar_stock": 0,
    "mostrar_precio": 1,
    "entidad_id": this.api.user.entidad_id,
  };
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public viewctrl: ViewController) {
    if (navParams.get('producto')) {
      this.producto = navParams.get('producto');
    }
  }

  ionViewDidLoad() {
  }

  save() {
    this.loading = true;
    var promise: Promise<any>;
    if (this.producto.id) {
      this.api.put('productos/' + this.producto.id, this.producto);
    } else {

      promise = this.api.post('productos', this.producto);
    }

    promise.then((data) => {
      this.loading = false;
      this.viewctrl.dismiss(data);
    })
      .catch((err) => {
        console.error(err);
        this.loading = false;
      })
  }

  canSave() {
    return this.producto.name.length > 2 && this.producto.precio > 1 && this.producto.referencia.length > 2
  }

  dismiss() {
    this.viewctrl.dismiss();
  }



}
