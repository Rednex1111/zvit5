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
  lang = 'ua';

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public authenticationService: AuthenticationServiceProvider,
                public WPService: WordpressService) {
      authenticationService.getUserLang()
        .then(res => {
          if (!res) {
            this.lang = 'ua';
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
      this.WPService.getReferenceBook()
          .subscribe((data: any) => {
                for(let i = 0; i < data.length; i++){
                    if(data[i].parent == 11){
                        this.articles.push(data[i])
                    }
                }
                console.log(this.articles);
            this.articles = this.WPService.parseTextLang(this.articles, this.lang);
                  loading.dismiss();
              }
          )
  }

    openArticle(id){
        this.navCtrl.push(InfoReferenceBookPage, {
            id: id
        });
    }

}
