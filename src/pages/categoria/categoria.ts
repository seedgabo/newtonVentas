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
      name: "",
      description: "",
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
  }


  save() {
    var data = {
      "name": this.categoria.name,
      "description": this.categoria.description,
      "entidad_id": this.api.user.entidad_id,
    }
    this.loading = true;
    var promise: Promise<any>;
    if (this.categoria.id) {
      promise = this.api.put('categorias/' + this.categoria.id, data);
    } else {

      promise = this.api.post('categorias', data);
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
    return this.categoria.name.length > 2;
  }

  dismiss() {
    this.viewctrl.dismiss();
  }

}
