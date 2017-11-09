import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, IonicPage } from 'ionic-angular';
import { Api } from '../../providers/Api';
// import { HomePage } from "../home/home";
import { DomSanitizer } from '@angular/platform-browser';
@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  register = false;
  send = {
    password: "",
    password_confirmation: "",
    nombre: "",
    email: "",
    cedula: "",
    code: "",
    notas: "",
    cliente_id: 1,
  }
  terms = false;
  backimg;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api, public alert: AlertController, public loading: LoadingController, private sanitizer: DomSanitizer) {
  }

  ionViewDidLoad() {
    this.api.ready.then(() => {
      this.backimg = this.sanitizer.bypassSecurityTrustStyle("url('" + this.api.url + "img/fondo (1).jpg')");
      console.log(this.backimg);
    })
  }

  doLogin() {
    var loading = this.loading.create({ content: "Iniciando Sesión" });
    loading.present();
    this.api.doLogin().then((response: any) => {
      loading.dismiss();
      this.api.saveUser(response);
      this.api.saveData()
      this.api.user = response;
      this.navCtrl.setRoot('HomePage');

    })
      .catch(() => {
        loading.dismiss();
        this.alert.create({ title: "Error", message: "Error al iniciar sesión", buttons: ["Ok"] }).present();
      });
  }

  registrarse() {
    this.register = !this.register;
  }

  canRegister() {
    return (this.send.password == this.send.password_confirmation && this.send.password.length > 5 && this.send.email.length > 5 && this.terms && this.send.nombre.length > 5 && this.send.cedula.length > 4 && this.send.notas.length == 8);
  }

  doRegister() {
    var loading = this.loading.create({ content: "Cargando" });
    loading.present();
    this.api.post('register', this.send)
      .then((data) => {
        loading.dismiss();
        console.log(data);
        this.api.username = this.send.email;
        this.api.password = this.send.password;
        this.api.user = data;
        this.api.saveUser(data);
        this.api.saveData()
        this.navCtrl.setRoot('HomePage');
      }).catch((err) => {
        loading.dismiss();
        console.error(err);
        this.alert.create({
          message: err.error + " " + err.error_message,
          title: "ERROR",
          buttons: ["OK"],
        }).present();
      })
  }

  forgotPassword() {
    this.alert.create({
      title: "Olvide mi contraseña",
      inputs: [
        {
          label: 'email',
          type: 'email',
          name: 'email',
          placeholder: 'Correo'
        }
      ],
      buttons: [
        {
          text: 'Recuperar',
          handler: (data) => {
            var email = data.email;
            this.api.get('forgot-password?email=' + email)
              .then((data) => {
                this.alert.create({
                  title: "correo enviado",
                  subTitle: "Revise su bandeja de entrada",
                  buttons: ["OK"]
                }).present();
              })
              .catch((err) => {
                this.alert.create({
                  title: "no se pudo enviar el correo de recuperación",
                  buttons: ["OK"]
                }).present();
              });
          }
        }
      ]
    }).present();
  }

}
