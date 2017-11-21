import { Api } from './../../providers/Api';
import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController, Searchbar } from 'ionic-angular';
@Component({
  selector: 'page-product-search',
  templateUrl: 'product-search.html',
})
export class ProductSearchPage {
  query = ""
  products = { data: [] };
  @ViewChild('searchbar') searchbar: Searchbar;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewctrl: ViewController, public api: Api) {
    this.api.storage.get('recent_products')
      .then((recent_products) => {
        if (recent_products) {
          this.products = recent_products;
        }
      });
  }

  ionViewDidLoad() {
    setTimeout(() => {
      this.searchbar.setFocus();
    }, 300);
  }
  // search() {
  //   this.api.get(`productos?where[entidad_id]=${this.api.user.entidad_id}&whereLike[name]=${this.query}&paginate=50&with[]=image`)
  //     .then((data: any) => {
  //       this.products = data;
  //       this.api.storage.set('recent_products', data);
  //     })
  //     .catch(console.error)
  // }
  search() {
    if (this.query == '') {
      return this.products.data = this.api.productos;
    }
    var filter = this.query.toLowerCase()
    this.products.data = this.api.productos.filter((prod) => {
      return prod.name.toLowerCase().indexOf(filter) > -1
        || (prod.referencia && prod.referencia.toLowerCase().indexOf(filter) > -1)
        || (prod.description && prod.description.toLowerCase().indexOf(filter) > -1)
    })
    this.api.storage.set('recent_products', this.products);
  }

  cancel() {
    this.viewctrl.dismiss(null, "cancel");
  }
  select(product) {
    this.viewctrl.dismiss(product, "accept");
  }
}
