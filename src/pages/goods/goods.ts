import { Component } from '@angular/core';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { WordpressService } from '../../providers/wordpress.service';
import { AuthenticationServiceProvider } from '../../providers/authentication-service/authentication-service';
import {GoodInfoPage} from "../good-info/good-info";


@Component({
  selector: 'page-bills',
  templateUrl: 'goods.html',
})
export class GoodsPage {

  goods = [];
  product_id: string;


  constructor(public authenticationService: AuthenticationServiceProvider,
              public navCtrl: NavController,
              public navParam: NavParams,
              public loadingCtrl: LoadingController,
              public wordpressService: WordpressService,) {
  }

  ionViewDidLoad() {
      let id = this.navParam.get('group_id');
      this.authenticationService.getUser()
          .then(
              data =>{
                  let loading = this.loadingCtrl.create({
                      spinner: 'bubbles'
                  });
                  loading.present();

                  this.wordpressService.getProduct(data.nonce, data.cookie, id)
                      .subscribe((data:any)=> {
                          for (let good of data.response.products){
                              this.product_id = good.product_id;
                              this.goods.push(good);
                          }
                          console.log(this.goods);
                          loading.dismiss();

                      },err => {
                        loading.dismiss();
                        console.log(JSON.stringify(err));
                      });
              });

  }

  productTapped(product_id){
      this.navCtrl.push(GoodInfoPage, {
          'product_id': product_id
      });
  }
}
