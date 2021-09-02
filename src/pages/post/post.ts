import { Component } from '@angular/core';
import { NavParams, NavController, LoadingController, AlertController, ViewController } from 'ionic-angular';
import { WordpressService } from '../../providers/wordpress.service';
import { AuthenticationServiceProvider } from '../../providers/authentication-service/authentication-service';


@Component({
  selector: 'page-post',
  templateUrl: 'post.html'
})
export class PostPage {

  post: any;
  user: string;
  comments: Array<any> = new Array<any>();
  categories: Array<any> = new Array<any>();
  morePagesAvailable: boolean = true;

  constructor(
    public navParams: NavParams,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationServiceProvider
  ) {

  }
  previousPage(){
      this.viewCtrl.dismiss();
    }

  ionViewWillEnter(){
    this.morePagesAvailable = true;
    let loading = this.loadingCtrl.create();
    loading.present();

    this.post = this.navParams.get('item');
    this.authenticationService.getUser()
          .then(
              data =>{
                  this.getPostData(data.nonce, data.cookie)
                      .subscribe((data:any) => {
                          loading.dismiss();
                      },err => {
                        loading.dismiss();
                        console.log(JSON.stringify(err));
                      })

              })
    }

  getPostData(nonce, cookie){
    return this.wordpressService.getPostData(nonce, cookie, this.post.post_id);
  }

}
