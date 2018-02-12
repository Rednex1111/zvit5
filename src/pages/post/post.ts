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
                      .subscribe(data => {
                          loading.dismiss();
                      });
              })
    }

  getPostData(nonce, cookie){
    return this.wordpressService.getPostData(nonce, cookie,this.post.post_id);
  }


/*  loadMoreComments(infiniteScroll) {
    let page = (this.comments.length/10) + 1;
    this.wordpressService.getComments(this.post.id, page)
    .subscribe(data => {
      for(let item of data){
        this.comments.push(item);
      }
      infiniteScroll.complete();
    }, err => {
      console.log(err);
      this.morePagesAvailable = false;
    })
  }

  goToCategoryPosts(categoryId, categoryTitle){
    this.navCtrl.push(NewsPage, {
      id: categoryId,
      title: categoryTitle
    })
  }

  createComment(){
    let user: any;

    this.authenticationService.getUser()
    .then(res => {
      user = res;

      let alert = this.alertCtrl.create({
      title: 'Add a comment',
      inputs: [
        {
          name: 'comment',
          placeholder: 'Comment'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Accept',
          handler: data => {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.wordpressService.createComment(this.post.id, user, data.comment)
            .subscribe(
              (data) => {
                console.log("ok", data);
                this.getComments();
                loading.dismiss();
              },
              (err) => {
                console.log("err", err);
                loading.dismiss();
              }
            );
          }
        }
      ]
    });
    alert.present();
    },
    err => {
      console.log(err)
      let alert = this.alertCtrl.create({
        title: 'Please login',
        message: err,
        buttons: [
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          },
          {
            text: 'Login',
            handler: () => {
              this.navCtrl.push(LoginPage);
            }
          }
        ]
      });
    alert.present();
    });


  }*/
}
