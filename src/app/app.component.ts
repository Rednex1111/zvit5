import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { ContactsPage } from "../pages/contacts/contacts";
import { NewsPage } from "../pages/news/news";
import { EnterprisesPage } from "../pages/enterprises/enterprises";
import { BeaconCommunicationPage } from "../pages/beacon-communication/beacon-communication";
import { ReferenceBookPage } from "../pages/reference-book/reference-book";
import { GroupsGoodsPage} from "../pages/groups-goods/groups-goods";
import { SettingsPage } from "../pages/settings/settings";
import { TranslateService, LangChangeEvent} from '@ngx-translate/core';
import {WelcomePage} from "../pages/welcome/welcome";
import {AuthenticationServiceProvider} from '../providers/authentication-service/authentication-service';
import { FCM } from "@ionic-native/fcm";
import { AlertController } from "ionic-angular";
import {Sim} from "@ionic-native/sim";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  //textDir: string = "ltr";
  lang: string;
  public pages: Array<{ title: string, component: any, icon: string }>;


  constructor( public platform: Platform,
               public statusBar: StatusBar,
               public splashScreen: SplashScreen,
               public translate: TranslateService,
              public alertCtrl: AlertController,
              public fcm: FCM,
              public sim: Sim,
              public authenticationService: AuthenticationServiceProvider) {

    this.initializeApp();
    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'NewsPage', component: NewsPage, icon: 'logo-designernews'},
      {title: 'ReferenceBookPage', component: ReferenceBookPage, icon: 'book'},
      {title: 'EnterprisesPage', component: EnterprisesPage, icon: 'briefcase'},
      {title: 'GoodsPage', component: GroupsGoodsPage, icon: 'cart'},
      {title: 'BeaconCommunicationPage', component: BeaconCommunicationPage, icon: 'call'},
      {title: 'ContactsPage', component: ContactsPage, icon: 'people'},
      {title: 'SettingsPage', component: SettingsPage, icon: 'settings'},
      {title: 'exit', component: 'exit', icon: 'log-out'}
    ];
    this.push();
  }

  initializeApp() {
    this.authenticationService.getUserLang()
      .then(res => {
        if (!res) {
          this.translate.setDefaultLang('ua');
          this.translate.use('ua');
          this.lang = 'ua';
        } else {
          this.lang = res.language;
          this.translate.setDefaultLang(res.language);
          this.translate.use(res.language);
        }
      });
    this.sim.requestReadPermission().then(
      () => console.log('Permission granted '),
      () => console.log('Permission denied ')
    );
    //this is to determine the text direction depending on the selected language
   /* this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
      this.textDir = event.lang == 'ar' ? 'rtl' : 'ltr';
    });*/


    this.authenticationService.getUser()
      .then(
        data => {
          //console.log(data);
          if (data) {
            this.rootPage = NewsPage;
          } else {
            this.rootPage = WelcomePage;
          }
        },
        error => {
          this.rootPage = WelcomePage
        }
      );
    // Okay, so the platform is ready and our plugins are available.
    // Here you can do any higher level native things you might need.
    this.statusBar.styleDefault();
    this.splashScreen.hide();
  }


  goToPage(page) {
    if (page.title === 'exit') {
      this.authenticationService.logOut();
      this.nav.setRoot(WelcomePage);
    } else {
      this.nav.setRoot(page.component).then(callBack => {
        this.translate.get(`${page.title}`,this.lang).subscribe(
          res =>{
            document.getElementById('title_page').innerText = res;
          }
        );
      })
    }
  }

  push() {
    this.fcm.onNotification().subscribe(data => {
      if (data.wasTapped) {
        let alert_ms = this.alertCtrl.create({
          title: JSON.stringify(data.body),
          buttons: [
            {
              text: 'Ok',
              handler: data_company => {
                this.nav.setRoot(EnterprisesPage);
              }
            }
          ]
        });
        alert_ms.present();
      } else {
        let alert_ms = this.alertCtrl.create({
          title: JSON.stringify(data.body),
          buttons: [
            {
              text: 'Ok',
              handler: data_company => {
                this.nav.setRoot(EnterprisesPage);
              }
            }
          ]
        });
        alert_ms.present();
      }
    }, error => {
      console.log("error is " + JSON.stringify(error));
    })
  }
}
