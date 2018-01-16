import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Api } from '../../providers/Api';
@IonicPage()
@Component({
  selector: 'page-categoria',
  templateUrl: 'categoria.html',
})
export class CategoriaPage {
  categoria = {
      id: null,
      nombre: "",
      descripción: "",
      parent_id: null

  }
  categories = [];
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl:ViewController, public api:Api) {
     if(this.navParams.get('categoria')){
       this.categoria =  this.navParams.get('categoria')
     }

     if(this.navParams.get('categories')){
       this.categories =  this.navParams.get('categories')
     }
     else{
       this.categories = this.api.categorias
     }
  }


  save() {
    var data = {
      "nombre": this.categoria.nombre,
      "descripción": this.categoria.descripción,
      "entidad_id": this.api.user.entidad_id,
    }
    this.loading = true;
    var promise: Promise<any>;
    if (this.categoria.id) {
      promise = this.api.put('categorias-productos/' + this.categoria.id, data);
    } else {

      promise = this.api.post('categorias-productos', data);
    }

    promise
    .then((data) => {
      this.loading = false;
      this.viewctrl.dismiss(data);
    })
    .catch((err) => {
      console.error(err);
      this.loading = false;
    })
  }

  canSave() {
    return this.categoria.nombre.length > 2;
  }

  dismiss() {
    this.viewctrl.dismiss();
  }

}
