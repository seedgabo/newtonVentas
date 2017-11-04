import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-cliente-editor',
  templateUrl: 'cliente-editor.html',
})
export class ClienteEditorPage {
  cliente: any = {
    nombres: "",
    apellidos: "",
    nit: "",
    direccion: "",
    email: "",
    sexo: "M",
    codigo: "",
  }
  more = false;
  loading = false;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    if (navParams.get('cliente'))
      this.cliente = navParams.get('cliente');
  }

  ionViewDidLoad() {

  }

  save() {
    var promise: Promise<any>
    this.loading = true;
    if (this.cliente.id) {
      promise = this.api.put('clientes/' + this.cliente.id, this.cliente)
    }
    else {
      promise = this.api.post('clientes', this.cliente)
    }
    promise.then((data) => {
      this.viewctrl.dismiss(data);
      this.loading = false
    })
      .catch((err) => {
        this.loading = false
      })
  }

  dismiss() {
    this.viewctrl.dismiss();
  }

  canSave() {
    return this.cliente.nombres.length > 2 &&
      this.cliente.nit.length > 3;
  }
}
