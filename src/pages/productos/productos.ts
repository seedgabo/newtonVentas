import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-productos',
  templateUrl: 'productos.html',
})
export class ProductosPage {
  _productos = [];
  productos = [];
  query = ""
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.api.get('productos?where[entidad_id]=' + this.api.user.entidad_id)
      .then((data: any) => {
        console.log(data)
        this._productos = data;
        this.filter();
        this.loading = false;
      })
      .catch((err) => {
        console.error(err)
        this.loading = false;
      })
  }

  filter() {
    if (this.query == '') {
      return this.productos = this._productos;
    }
    var filter = this.query.toLowerCase()
    this.productos = this._productos.filter((prod) => {
      return prod.name.toLowerCase().indexOf(this) > -1;
    })
  }

}
