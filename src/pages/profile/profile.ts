import { Component } from '@angular/core';
import { ToastController, AlertController, NavController, NavParams, Events } from 'ionic-angular';
import { Api } from '../../providers/Api';

@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html'
})
export class ProfilePage {
  password_confirm: string = "";
  password: string = "";
  oldpassword: string = "";

  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public toast: ToastController, public events: Events) { }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

  changePassword() {
    this.api.get(`changePassword?oldpassword=${this.oldpassword}&password=${this.password}&password_confirm=${this.password_confirm}`)
      .then((data: any) => {
        if (data.status == "error") {
          this.alert.create({ message: data.message, buttons: ["Ok"] }).present();
          return;
        }
        this.toast.create({ duration: 1500, message: "contraseña actualizada" }).present();
        this.events.publish('logout', {});
      })
      .catch((err) => {
        console.error(err);
        this.alert.create({
          title: "No se pudo actualizar la contraseña",
          message: err, buttons: ["Ok"]
        }).present();
      });
  }

}
