import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
@Component({
  selector: 'page-cliente-search',
  templateUrl: 'cliente-search.html',
})
export class ClienteSearchPage {
  query = ""
  clientes = { data: [] };
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    this.api.storage.get('recent_clientes')
      .then((recent_clientes) => {
        if (recent_clientes) {
          this.clientes = recent_clientes;
        }
      });
  }

  ionViewDidLoad() {
  }
  search() {
    this.api.get(`clientes?orWhereLike[cedula]=${this.query}&orWhereLike[nit]=${this.query}&orWhereLike[nombres]=${this.query}&paginate=50`)
      .then((data: any) => {
        this.clientes = data;
        this.api.storage.set('recent_clientes', data);
      })
      .catch(console.error)
  }
  cancel() {
    this.viewctrl.dismiss(null, "cancel");
  }
  select(cliente) {
    this.viewctrl.dismiss(cliente, "accept");
  }
}
