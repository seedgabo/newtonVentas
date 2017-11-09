import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController } from 'ionic-angular';
import { ToastController } from 'ionic-angular/components/toast/toast-controller';

@IonicPage()
@Component({
  selector: 'page-productos',
  templateUrl: 'productos.html',
})
export class ProductosPage {
  productos = [];
  query = ""
  loading = false;
  producto_image;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public modal: ModalController, public actionsheet: ActionSheetController, public toast: ToastController) {
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
      return prod.name.toLowerCase().indexOf(filter) > -1 ||
        (prod.description && prod.description.toLowerCase().indexOf(filter) > -1);
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
        text: "Editar Imagen",
        icon: "camera",
        handler: () => {
          this.askFile(producto)
        }
      }, {
        text: "Eliminar",
        icon: "trash",
        handler: () => {
          this.delete(producto, index)
        }
      }]
    }).present()
  }

  edit(producto) {
    var modal = this.modal.create("ProductoPage", { producto: producto })
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        producto = data;
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


  askFile(producto) {
    this.producto_image = producto;
    var filer: any = document.querySelector("#input-file")
    filer.click();
  }

  readFile(event) {
    try {
      var reader: any = new FileReader();
      reader.readAsDataURL(event.target.files[0])
      reader.onload = (result) => {
        this.producto_image.image_url = result.target.result;
        this.uploadImage(this.producto_image.id)
      };
    } catch (error) {
      console.error(error)
    }
  }

  uploadImage(id) {
    return this.api.post('images/upload/producto/' + id, { image: this.producto_image.image_url })
      .then((data: any) => {
        console.log(data);
        this.producto_image.image = data.image;
        this.producto_image.image_url = data.url;
        this.toast.create({
          message: "Imagen Actualizada",
          duration: 1500,
          showCloseButton: true,
        }).present();
      })
      .catch(console.error)
  }

}
