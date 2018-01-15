import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController,ActionSheetController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-categories',
  templateUrl: 'categories.html',
})
export class CategoriesPage {
  loading = false;
  query =""
  categorias = []
  constructor(public navCtrl: NavController, public navParams: NavParams,public modal:ModalController, public actionsheet:ActionSheetController, public api:Api) {
  }


  ionViewDidLoad() {
    this.loadItems();
  }

  loadItems() {
    this.loading = true;
    this.api.get('categorias?where[entidad_id]=' + this.api.user.entidad_id)
      .then((data: any) => {
        console.log(data)
        this.api.categorias = data;
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
      return this.categorias = this.api.categorias;
    }
    var filter = this.query.toLowerCase()
    this.categorias = this.api.categorias.filter((cat) => {
      return cat.name.toLowerCase().indexOf(filter) > -1 ||
        (cat.description && cat.description.toLowerCase().indexOf(filter) > -1);
    })
  }

  actions(Categoria, index) {
    this.actionsheet.create({
      title: "Acciones",
      buttons: [{
        text: "Editar",
        icon: "create",
        handler: () => {
          this.edit(Categoria)
        }
      }, {
        text: "Editar Imagen",
        icon: "camera",
        handler: () => {
          this.askFile(Categoria)
        }
      }, {
        text: "Eliminar",
        icon: "trash",
        handler: () => {
          this.delete(Categoria, index)
        }
      }]
    }).present()
  }

  edit(Categoria) {
    var modal = this.modal.create("CategoriaPage", { Categoria: Categoria })
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        Categoria = data;
      }

    })
  }

  delete(Categoria, index) {
    this.api.delete('categorias/' + Categoria.id)
      .then((data) => {
        this.api.categorias.splice(index, 1);
        this.filter();
      })
      .catch(console.error)
  }

  add() {
    var modal = this.modal.create("CategoriaPage")
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.api.categorias.push(data);
        this.filter();
      }

    })
  }

}
