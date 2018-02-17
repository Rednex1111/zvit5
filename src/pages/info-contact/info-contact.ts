import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { WordpressService} from "../../providers/wordpress.service";
import { AuthenticationServiceProvider } from "../../providers/authentication-service/authentication-service";

@Component({
    selector: 'page-info-contact',
    templateUrl: 'info-contact.html',
})
export class InfoContactPage {
    title: any;
    lang: any;
    contact_info = [];
    constructor(public navCtrl: NavController,
                public WPService: WordpressService,
                public authenticationService: AuthenticationServiceProvider,
                public navParams: NavParams) {
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
      let id = this.navParams.get('id');
      let cookie = this.navParams.get('cookie');
      this.WPService.getContactInfoById(id, cookie)
        .subscribe((data: any) => {
            this.contact_info.push(data.response.post);
            this.contact_info = this.WPService.parseTextLang(this.contact_info, this.lang);
            this.title =  this.contact_info[0].title;
            this.contact_info = this.contact_info[0].content;
          }
        );
    }

}
