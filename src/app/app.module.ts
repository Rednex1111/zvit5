import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule, forwardRef } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
//pages
import { MyApp } from './app.component';
import { NewsPage } from "../pages/news/news";
import { WelcomePage } from '../pages/welcome/welcome';
import { LoginPage } from "../pages/login/login";
import { HeaderPage} from "../pages/header/header";
import { RegisterPage } from "../pages/register/register";
import { EnterprisesPage } from "../pages/enterprises/enterprises";
import { SettingsPage } from "../pages/settings/settings";
import { ReferenceBookPage } from "../pages/reference-book/reference-book";
import { GoodsPage } from "../pages/goods/goods";
import { GroupsGoodsPage} from "../pages/groups-goods/groups-goods";
import { BeaconCommunicationPage } from "../pages/beacon-communication/beacon-communication";
import { ContactsPage} from "../pages/contacts/contacts";
import { GoodInfoPage} from "../pages/good-info/good-info";
import { PostPage} from "../pages/post/post";
import { InfoReferenceBookPage} from "../pages/info-reference-book/info-reference-book";
import { InfoEnterprisesPage} from "../pages/info-enterprises/info-enterprises";
import { InfoContactPage} from "../pages/info-contact/info-contact";
//default module
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

//my import module
import { AuthenticationServiceProvider } from '../providers/authentication-service/authentication-service';
import { WordpressService } from '../providers/wordpress.service';
import { LanguageService } from '../providers/language.service';
//import install module
import { HttpClientModule, HttpClient} from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AgmCoreModule } from "@agm/core";


export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
    NewsPage,
    WelcomePage,
    LoginPage,
    HeaderPage,
    RegisterPage,
    EnterprisesPage,
    SettingsPage,
    ReferenceBookPage,
    GoodsPage,
    GroupsGoodsPage,
    BeaconCommunicationPage,
    InfoReferenceBookPage,
    InfoEnterprisesPage,
    ContactsPage,
    GoodInfoPage,
    PostPage,
    InfoContactPage
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicStorageModule.forRoot(),
    IonicModule.forRoot(MyApp),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    }),
    AgmCoreModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    NewsPage,
    WelcomePage,
    LoginPage,
    HeaderPage,
    RegisterPage,
    EnterprisesPage,
    SettingsPage,
    ReferenceBookPage,
    GoodsPage,
    GroupsGoodsPage,
    BeaconCommunicationPage,
    InfoReferenceBookPage,
    InfoEnterprisesPage,
    ContactsPage,
    GoodInfoPage,
    PostPage,
    InfoContactPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LanguageService,
    forwardRef(() => WordpressService),
    forwardRef(() => AuthenticationServiceProvider),
    {provide: ErrorHandler, useClass: IonicErrorHandler},

  ]
})
export class AppModule {}
