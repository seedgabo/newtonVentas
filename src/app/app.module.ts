import { ClienteSearchPage } from './../pages/cliente-search/cliente-search';
import { ProductSearchPage } from './../pages/product-search/product-search';
import { IonicStorageModule } from '@ionic/storage';
import { Api } from './../providers/Api';
import { LoginPage } from './../pages/login/login';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HttpModule } from '@angular/http';
import { Printer } from '@ionic-native/printer';
import { CodePush } from "@ionic-native/code-push";
@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    ProductSearchPage,
    ClienteSearchPage,
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    HomePage,
    ListPage,
    ProductSearchPage,
    ClienteSearchPage,
  ],
  providers: [
    StatusBar,
    SplashScreen, Printer, CodePush,
    Api,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
