import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { WordpressService } from "../../providers/wordpress.service";

@Component({
  selector: 'page-info-reference-book',
  templateUrl: 'info-reference-book.html',
})
export class InfoReferenceBookPage {

  constructor(public navCtrl: NavController,
              public WPService: WordpressService,
              public navParams: NavParams) {
  }

  context_artice: any;

  ionViewDidLoad() {
    let id = this.navParams.get('id');
    this.WPService.getReferenceBookById(id)
          .subscribe( (res: any)=> {
             this.context_artice = res.excerpt.rendered;
          });
  }

}
