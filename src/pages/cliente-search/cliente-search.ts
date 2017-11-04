import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
@Component({
  selector: 'page-cliente-search',
  templateUrl: 'cliente-search.html',
})
export class ClienteSearchPage {
  query = ""
  clientes = { data: [] };
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api, public modal: ModalController) {
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

  addCliente() {
    var modal = this.modal.create("ClienteEditorPage", {}, { cssClass: "modal-large" })
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.clientes.data = [data].concat(this.clientes.data);
      }
    })
  }
}
