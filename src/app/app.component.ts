import { CodePush } from '@ionic-native/code-push';
import { Api } from './../providers/Api';
import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// import { HomePage } from '../pages/home/home';
// import { ListPage } from '../pages/list/list';
// import { LoginPage } from './../pages/login/login';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  pages: Array<{ title: string, component: any, icon: string }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public api: Api, public codepush: CodePush) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Punto de Venta', component: 'HomePage', icon: 'home' },
      { title: 'Facturas', component: 'ListPage', icon: 'list' },
      { title: 'Productos', component: 'ProductosPage', icon: 'cart' },
      { title: 'Configuración', component: 'SettingsPage', icon: 'settings' },
    ];
    this.api.ready.then((data) => {
      if (data) {
        this.rootPage = 'HomePage';
      }
      else {
        this.rootPage = 'LoginPage';
      }
    })

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.codepush.sync({ updateDialog: false })
        .subscribe((data) => {
          console.log("codepush", data)
        }, console.warn)

    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    this.api.storage.remove('user');
    this.api.storage.remove('username');
    this.api.storage.remove('passowrd');
    this.api.user = null;
    this.api.username = null;
    this.api.password = null;
    this.nav.setRoot('LoginPage');
  }
}
