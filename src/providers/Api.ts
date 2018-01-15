import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Http, Headers } from '@angular/http';
// import { Observable } from "rxjs/Observable";
import 'rxjs/add/operator/map';
import { Storage } from '@ionic/storage';

@Injectable()
export class Api {
  username: string;
  password: string;
  token: string;
  url: string = 'http://newton.eycproveedores.com/newtonPenon/public/';
  user: any = null;
  ready = new Promise((resolve, reject) => {
    this.resolve = resolve;
  })
  settings: any = {};
  settings_invoices: any = {
    nombre: null,
    nit: null,
    resolucion: null,
    cabecera: null,
    imagen: null,
    pie: 'Advertencia, Propina: Por disposición de la superintendencia de Industria y Comercio se informa que en este establecimiento la propina es sugerida al consumidor y corresponde al 10% del subtotal de la cuenta, el cual podrá ser aprobado, rechazado o modificado por usted, de acuerdo con su valoración del servicio prestado. Si no desea cancelar dicho valor haga caso al mismo, si desea cancelar un valor diferente indíquelo así para hacer el ajuste correspondiente',
    tipo_impresion: 'pos',
  }
  resolve;
  invoices = [];
  productos = [];
  categorias = [];
  constructor(public http: Http, public storage: Storage, public alert: AlertController) {
    this.initVar();
  }

  initVar() {
    this.storage.get("username").then((data) => data != undefined ? this.username = data : '');
    this.storage.get("password").then((data) => data != undefined ? this.password = data : '');
    this.storage.get("settings").then((data) => data != undefined ? this.settings = data : '');
    this.storage.get("settings_invoices").then((data) => data != undefined ? this.settings_invoices = data : '');
    this.storage.get("user").then((data) => {
      data != undefined ? this.user = JSON.parse(data) : null;
      this.resolve(this.user);
    });

    this.storage.get("invoices").then((data) => data != undefined ? this.invoices = data : []);
  }

  saveData() {
    this.storage.set("username", this.username);
    this.storage.set("password", this.password);
    this.storage.set("url", this.url);
  };

  saveUser(user) {
    this.storage.set("user", JSON.stringify(user));
  }

  doLogin() {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/login", { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  get(uri) {
    return new Promise((resolve, reject) => {
      this.http.get(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  post(uri, data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }
  put(uri, data) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + "api/" + uri, data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }

  delete(uri) {
    return new Promise((resolve, reject) => {
      this.http.delete(this.url + "api/" + uri, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => {
          return reject(this.handleData(error));
        });
    });
  }


  /*
  postPushtoken(data) {
    return new Promise((resolve, reject) => {
      this.http.post(this.url + "api/dispositivos", data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => { return reject(this.handleData(error)) });
    });
  }

  pushRegister() {
    let push: any = this.push.init({
      android: {
        senderID: "600000041642",
        clearNotifications: 'false',
      },
      ios: {
        alert: "true",
        badge: true,
        sound: 'true'
      },
      windows: {}
    });

    if (typeof push.error === 'undefined' || push.error === null) {
      let body;
      push.on('registration', (data) => {
        console.log(data.registrationId);
        if (this.platform.is('android'))
          body = "token=" + data.registrationId + "&plataforma=android";
        else
          body = "token=" + data.registrationId + "&plataforma=ios";

        this.postPushtoken(body).then(Response => {
          this.pushData = Response;
          this.savePushData(Response);
        });
      });

      push.on('notification', (data) => {
        console.log(data.message);
        console.log(data.title);
        console.log(data.count);
        console.log(data.sound);
        console.log(data.image);
        console.log(data.additionalData);
      });

      push.on('error', (e) => {
        console.log(e.message);
      });
      return true;
    }
    return false;
  }

  savePushData(pushData) {
    this.storage.set('pushData', JSON.stringify(pushData));
  }

  putPushData(id, data) {
    return new Promise((resolve, reject) => {
      this.http.put(this.url + "api/dispositivos/" + id, data, { headers: this.setHeaders() })
        .map(res => res.json())
        .subscribe(data => {
          resolve(data);
        }, error => { return reject(this.handleData(error)) });
    });
  }
  */

  private setHeaders() {
    let headers = new Headers();
    // console.log(this.username, this.password);
    headers.append("Authorization", "Basic " + btoa(this.username + ":" + this.password));
    return headers;
  }

  handleData(error) {
    console.error(error)
    var message = "";
    if (error.error == 500 || error.errorStatus == 500) {
      message = "Internal Server Error";
    }
    if (error.error == 404 || error.errorStatus == 404) {
      message = "Not Found"
    }
    if (error.error == 401 || error.errorStatus == 401) {
      message = "Unathorized"
    }
    this.alert.create({
      title: "Network Error",
      subTitle: error.error,
      message: message,
      buttons: ["OK"],

    }).present();

    return error;
  }
}
