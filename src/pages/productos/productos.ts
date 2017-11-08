import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-productos',
  templateUrl: 'productos.html',
})
export class ProductosPage {
  productos = [];
  query = ""
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public modal: ModalController, public actionsheet: ActionSheetController) {
  }

  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.api.get('productos?where[entidad_id]=' + this.api.user.entidad_id)
      .then((data: any) => {
        console.log(data)
        this.api.productos = data;
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
      return this.productos = this.api.productos;
    }
    var filter = this.query.toLowerCase()
    this.productos = this.api.productos.filter((prod) => {
      return prod.name.toLowerCase().indexOf(this) > -1;
    })
  }

  actions(producto, index) {
    this.actionsheet.create({
      title: "Acciones",
      buttons: [{
        text: "Editar",
        icon: "create",
        handler: () => {
          this.edit(producto)
        }
      }, {
        text: "Eliminar",
        icon: "trash",
        handler: () => {
          this.delete(producto, index)
        }
      }]
    })
  }

  edit(producto) {
    var modal = this.modal.create("ProductoPage", { producto: producto })
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.api.productos.push(data);
        this.filter();
      }

    })
  }

  delete(producto, index) {
    this.api.delete('productos/' + producto.id)
      .then((data) => {
        this.api.productos.splice(index, 1);
        this.filter();
      })
      .catch(console.error)
  }

  add() {
    var modal = this.modal.create("ProductoPage")
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.api.productos.push(data);
        this.filter();
      }

    })
  }

}
