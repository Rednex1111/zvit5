import { Component } from '@angular/core';
import { PostPage } from '../post/post';
import { NavController, LoadingController, NavParams } from 'ionic-angular';
import { WordpressService } from '../../providers/wordpress.service';
import { AuthenticationServiceProvider } from '../../providers/authentication-service/authentication-service';
import { TranslateService } from "@ngx-translate/core";

@Component({

  selector: 'page-home',
  templateUrl: 'news.html'
})
export class NewsPage {
  posts: Array<any> = new Array<any>();
  posts_by_id: Array<any> = new Array<any>();
  show_post: boolean;
  lang: string;
  cookie: string;
  nonce: string;
  //morePagesAvailable: boolean = true;
  loggedUser: boolean = false;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public translate: TranslateService,
    public loadingCtrl: LoadingController,
    public wordpressService: WordpressService,
    public authenticationService: AuthenticationServiceProvider
  ) {
      authenticationService.getUserLang()
          .then(res => {
              if (!res) {
                  this.lang = 'ua';
              } else {
                  this.lang = res.language;
              }
          });
      this.show_post = true;
  }

  ionViewWillEnter() {
    this.authenticationService.getUser()
    .then(
      data =>{
        if(data){
            this.loggedUser = true;
            this.cookie = data.cookie ;
            this.nonce = data.nonce;
            if(!(this.posts.length > 0)){
                let loading = this.loadingCtrl.create({
                    spinner: 'bubbles'
                });
                loading.present();
                this.getPosts();
                loading.dismiss();
                this.translate.get('NewsPage',this.lang).subscribe(
                    res =>{
                        document.getElementById('title_page').innerText = res;
                    });

            }
        } else {this.loggedUser = false }
      } ,
      error => this.loggedUser = false
    );

  }

  getPosts() {
      this.posts = [];
      this.wordpressService.getRecentPosts(this.nonce, this.cookie )
          .subscribe((data: any) => {
              for(let post of data.response.posts){
                  this.posts.push(post);
              }
              this.posts = this.wordpressService.parseTextLang(this.posts, this.lang);

              if (this.posts.length > 0){
                  this.show_post = true;
              } else {
                  this.show_post = false;
              }
          });
  }

  postTapped(event, post) {
		this.navCtrl.push(PostPage, {
		  item: post
		});
  }

  doRefresh(refresher) {
        console.log('Begin async operation', refresher);
        this.posts = [];
        this.wordpressService.getRecentPosts(this.nonce, this.cookie )
            .subscribe((data :any) => {
                for(let post of data.response.posts){
                    this.posts.push(post);
                }
                this.posts = this.wordpressService.parseTextLang(this.posts, this.lang);
            });
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 2000);
    }

  CategoriesTaped(id) {
      document.getElementById('menu').style.display = 'none';
      document.getElementById('back').style.display = 'block';
      this.posts = [];
      this.wordpressService.getPostsById(this.nonce, this.cookie, id)
          .subscribe((data :any) => {
              for(let post of data.response.posts){
                  this.posts.push(post);
              }
              this.posts = this.wordpressService.parseTextLang(this.posts, this.lang);
          });

  }
}
