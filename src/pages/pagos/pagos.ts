import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { ViewController } from 'ionic-angular/navigation/view-controller';
@IonicPage()
@Component({
  selector: 'page-pagos',
  templateUrl: 'pagos.html',
})

export class PagosPage {
  pagos: any = [];
  total = 0;
  metodos = [
    "Efectivo",
    "Tarjeta de Debito",
    "Tarjeta de Credito",
    "Otro",
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController) {
    this.total = this.navParams.get('total');
  }

  ionViewDidLoad() {
  }

  add() {
    this.pagos = [{
      metodo: "Efectivo",
      monto: 0,
    }];
  }

  remove(index) {
    this.pagos.splice(index, 1);
  }

  cancel() {
    this.viewctrl.dismiss(null, "cancel");
  }

  save() {
    this.viewctrl.dismiss(this.pagos, "accept");
  }

  totalized() {
    var total = 0;
    this.pagos.forEach(element => {
      total += element.monto
    });
    return total;
  }

  canSave() {
    return this.totalized() == this.total;
  }
}
