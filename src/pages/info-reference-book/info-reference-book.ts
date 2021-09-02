import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WordpressService } from "../../providers/wordpress.service";
import { AuthenticationServiceProvider } from "../../providers/authentication-service/authentication-service";
@Component({
  selector: 'page-info-reference-book',
  templateUrl: 'info-reference-book.html',
})
export class InfoReferenceBookPage {
  context_artice: any;
  reference_book_info = [];
  lang: any;

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
    this.WPService.getReferenceBookById(id, cookie)
      .subscribe((data: any) => {
          this.reference_book_info.push(data.response.post);
          this.reference_book_info = this.WPService.parseTextLang(this.reference_book_info, this.lang);
          this.reference_book_info = this.reference_book_info[0].content;
        }
      );
  }

}
