import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import { WordpressService} from "../../providers/wordpress.service";

@Component({
    selector: 'page-info-contact',
    templateUrl: 'info-contact.html',
})
export class InfoContactPage {
    context_artice: any;
    constructor(public navCtrl: NavController,
                public WPService: WordpressService,
                public navParams: NavParams) {
    }

    ionViewDidLoad() {
      let id = this.navParams.get('id');
      this.WPService.getContactInfoById(id)
        .subscribe( (res: any)=> {
          console.log(res);
          this.context_artice = res.content.rendered;
        });
    }

}
