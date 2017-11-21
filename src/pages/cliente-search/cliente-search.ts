import { Api } from './../../providers/Api';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, ModalController, ActionSheetController, Searchbar } from 'ionic-angular';
@Component({
  selector: 'page-cliente-search',
  templateUrl: 'cliente-search.html',
})
export class ClienteSearchPage {
  query = ""
  clientes = { data: [] };
  @ViewChild('searchbar') searchbar: Searchbar;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api, public modal: ModalController, public actionsheet: ActionSheetController) {
    this.api.storage.get('recent_clientes')
      .then((recent_clientes) => {
        if (recent_clientes) {
          this.clientes = recent_clientes;
        }
      });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 300);
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

  actions(cliente) {
    this.actionsheet.create({
      title: 'Acciones',
      buttons: [{
        text: "Editar",
        icon: 'create',
        handler: () => {
          this.editCliente(cliente);
        }
      }]
    })
  }

  addCliente() {
    var modal = this.modal.create("ClienteEditorPage", {}, { cssClass: "modal-large" })
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        this.clientes.data = [data].concat(this.clientes.data);
        this.api.storage.set('recent_clientes', this.clientes);
      }
    })
  }
  editCliente(cliente) {
    var modal = this.modal.create("ClienteEditorPage", { cliente: cliente }, { cssClass: "modal-large" })
    modal.present();
    modal.onDidDismiss((data) => {
      if (data) {
        cliente = data;
        this.api.storage.set('recent_clientes', this.clientes);
      }
    })
  }
}
