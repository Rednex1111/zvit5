import {Component} from '@angular/core';
import {NavController, LoadingController} from 'ionic-angular';
import {WordpressService} from "../../providers/wordpress.service";
import {InfoContactPage} from "../info-contact/info-contact";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})

export class ContactsPage {
  contacts = [];
  title: string;
  lang: any;
  cookie: any;

  constructor(public navCtrl: NavController,
              public WPService: WordpressService,
              public authenticationService: AuthenticationServiceProvider,
              public load: LoadingController) {
    authenticationService.getUserLang()
      .then(res => {
        if (!res) {
          this.lang = 'uk';
        } else {
          this.lang = res.language;
        }
      });
  }

  ionViewDidLoad() {
    let loading = this.load.create({
      spinner: 'bubbles'
    });
    loading.present();
    this.authenticationService.getUser()
      .then(
        res => {
          this.cookie = res.cookie;
          this.WPService.getContactInfo(res.cookie)
            .subscribe((data: any) => {
                for (let reference of data.response.pages) {
                  this.contacts.push(reference)

                }
                this.contacts = this.WPService.parseTextLang(this.contacts, this.lang);
                /*console.log(this.contacts[1].slug);*/
                loading.dismiss();
              },err => {
                loading.dismiss();
                console.log(JSON.stringify(err));
              }
            );
        });
  }

  goToMap(id, title) {
    this.navCtrl.push(InfoContactPage,
      {
        id: id,
        cookie: this.cookie,
        title: title
      });
  }

}
