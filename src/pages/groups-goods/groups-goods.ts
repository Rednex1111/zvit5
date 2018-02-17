import {Component} from '@angular/core';
import {LoadingController, NavController} from 'ionic-angular';
import {WordpressService} from '../../providers/wordpress.service';
import {AuthenticationServiceProvider} from '../../providers/authentication-service/authentication-service';
import {GoodsPage} from "../goods/goods";


@Component({
    selector: 'page-groups-goods',
    templateUrl: 'groups-goods.html',
})
export class GroupsGoodsPage {
    groups = [];
    group_id: string;
    lang: any;
    constructor(public authenticationService: AuthenticationServiceProvider,
                public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public wordpressService: WordpressService,) {
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
        this.authenticationService.getUser()
            .then(
                data => {
                    let loading = this.loadingCtrl.create({
                        spinner: 'bubbles'
                    });
                    loading.present();

                    this.wordpressService.getGroups(data.nonce, data.cookie)
                        .subscribe((data :any)=> {
                            for (let group of data.response.groups) {
                                this.group_id = group.group_id;
                                this.groups.push(group);
                            }
                          this.groups = this.wordpressService.parseTextLang(this.groups, this.lang);
                            loading.dismiss();
                        });
                });

    }

    productTapped(group_id) {
        this.navCtrl.push(GoodsPage, {
            'group_id': group_id
        });
    }

}
