import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { WordpressService } from "../../providers/wordpress.service";
import { InfoReferenceBookPage } from "../info-reference-book/info-reference-book";
import { AuthenticationServiceProvider } from "../../providers/authentication-service/authentication-service";

@Component({
  selector: 'page-reference-book',
  templateUrl: 'reference-book.html',
})
export class ReferenceBookPage {
  articles = [];
  url: any;
  cookie: any;
  lang = 'ua';

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public authenticationService: AuthenticationServiceProvider,
                public WPService: WordpressService) {
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
      let loading = this.loadingCtrl.create({
          spinner: 'bubbles'
      });
      loading.present();
      /*const regex = /<a *?href="(.*?)".*?<\/a>/;*/
    this.authenticationService.getUser()
      .then(
        res => {
          this.cookie = res.cookie;
          this.WPService.getReferenceBook(res.cookie)
            .subscribe((data: any) => {
                console.log(data);
                for(let reference of data.response.pages){
                  this.articles.push(reference)
                }
                this.articles = this.WPService.parseTextLang(this.articles, this.lang);
                loading.dismiss();
              }
            )
        }
      );

  }

    openArticle(id){
        this.navCtrl.push(InfoReferenceBookPage, {
            id: id,
            cookie: this.cookie,
        });
    }

}
