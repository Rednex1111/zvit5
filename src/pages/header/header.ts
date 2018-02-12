import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { NewsPage } from "../news/news";


@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  getPosts(){
    this.navCtrl.setRoot(NewsPage);
  }

}
