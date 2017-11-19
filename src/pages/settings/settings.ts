import { Api } from './../../providers/Api';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  timeout;
  constructor(public navCtrl: NavController, public navParams: NavParams, public api: Api) {
  }

  ionViewDidLoad() {
  }

  save() {
    clearTimeout(this.timeout)
    this.timeout = setTimeout(() => {
      this._save();
    }, 1200);
  }
  _save() {
    this.api.storage.set('settings_invoices', this.api.settings_invoices);
    console.log('saved');
  }

  askFile() {
    var filer: any = document.querySelector("#input-file")
    filer.click();
  }

  readFile(event) {
    try {
      if (!event.target.files || !event.target.files[0]) {
        return
      }
      var reader: any = new FileReader();

      reader.readAsDataURL(event.target.files[0])
      reader.onload = (result) => {
        this.api.settings_invoices.imagen = result.target.result;
        this._save();
      };
    } catch (error) {
      console.error(error)
    }
  }
}
