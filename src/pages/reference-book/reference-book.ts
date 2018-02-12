import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { WordpressService } from "../../providers/wordpress.service";
import { InfoReferenceBookPage } from "../info-reference-book/info-reference-book";

@Component({
  selector: 'page-reference-book',
  templateUrl: 'reference-book.html',
})
export class ReferenceBookPage {
  articles = [];
  url: any;
  content_true: boolean;

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public WPService: WordpressService) {
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
