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
          console.log(res);
          this.cookie = res.cookie;
          this.getPosts(res);
          loading.dismiss();
        }
      );

  }

  getPosts(res){
    this.WPService.getReferenceBook(res.cookie)
      .subscribe((data: any) => {
          console.log(data.response.pages);
          for(let reference of data.response.pages){
            this.articles.push(reference)
          }
          this.articles = this.WPService.parseTextLang(this.articles, this.lang);

        },err => {
          //loading.dismiss();
          console.log(JSON.stringify(err));
        }
      )
  }
    openArticle(id){
        this.navCtrl.push(InfoReferenceBookPage, {
            id: id,
            cookie: this.cookie,
        });
    }

}
