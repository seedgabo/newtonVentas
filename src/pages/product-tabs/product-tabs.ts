import { Component } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';
@IonicPage()
@Component({
  selector: 'page-product-tabs',
  templateUrl: 'product-tabs.html'
})
export class ProductTabsPage {

  productRoot = 'ProductosPage'
  categoriesRoot = 'CategoriesPage'


  constructor(public navCtrl: NavController) {}

}
