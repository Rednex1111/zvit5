import { Component } from '@angular/core';
import { NavController, LoadingController } from 'ionic-angular';
import { WordpressService } from "../../providers/wordpress.service";
import { InfoContactPage } from "../info-contact/info-contact";

@Component({
  selector: 'page-contacts',
  templateUrl: 'contacts.html',
})

export class ContactsPage {
  contacts = [];
  title: string;

  constructor(public navCtrl: NavController,
              public WPService: WordpressService,
              public load: LoadingController) {
  }

  ionViewDidLoad() {
      let loading = this.load.create({
          spinner: 'bubbles'
      });
      loading.present();

        this.WPService.getContactInfo()
            .subscribe((data:any) => {
                for(let i = 0; i < data.length; i++){
                    if(data[i].parent == 65){
                        this.contacts.push(data[i])
                    }
                }
                /*console.log(this.contacts[1].slug);*/
                loading.dismiss();
            }
        );
  }

  goToMap(id){
    console.log(id);
    this.navCtrl.push(InfoContactPage, {id: id});
     /* let regExp = /[<p>/\n]/g;

      Coordinate = Coordinate.replace(regExp, '').split(' ');
      console.log(Coordinate);
      this.navCtrl.push(InfoContactPage, {
        x: Coordinate[0],
        y: Coordinate[1]
      });*/
  }

}
