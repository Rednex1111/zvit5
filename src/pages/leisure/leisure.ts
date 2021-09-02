import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {TranslateService} from "@ngx-translate/core";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {WordpressService} from "../../providers/wordpress.service";
import {PostPage} from "../post/post";

/**
 * Generated class for the LeisurePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-leisure',
  templateUrl: 'leisure.html',
})
export class LeisurePage {

  posts: Array<any> = new Array<any>();
  private lang;
  public show_post = false;
  cookie: string;
  nonce: string;
  loggedUser: boolean = false;
  recepts = '';
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public translate: TranslateService,
              public authenticationService: AuthenticationServiceProvider,
              private loadingCtrl: LoadingController,
              private wordpressService: WordpressService) {
    authenticationService.getUserLang()
      .then(res => {
        if (!res) {
          this.lang = 'uk';
        } else {
          this.lang = res.language;
        }
      });
    this.show_post = true;

    this.translate.get('recepts', this.lang)
      .subscribe(res => {
        this.recepts = res;
      });

    this.translate.get('LeisurePage',this.lang).subscribe(
      res =>{
        document.getElementById('title_page').innerText = res;
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LeisurePage');
  }

  ionViewWillEnter() {
    let loading = this.loadingCtrl.create({
      spinner: 'bubbles'
    });
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
              this.translate.get('LeisurePage',this.lang).subscribe(
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
    let oldPosts = [];
    this.wordpressService.getRecentPosts(this.nonce, this.cookie )
      .subscribe((data: any) => {
        for(let post of data.response.posts){
          oldPosts.push(post);
        }
        oldPosts = this.wordpressService.parseTextLang(oldPosts, this.lang);

        for(let i = 0; i < oldPosts.length; i++){
          if(oldPosts[i].category_name == this.recepts){
            this.posts.push(oldPosts[i]);
          }
        }

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

  CategoriesTaped(id) {
    this.posts = [];
    this.wordpressService.getPostsById(this.nonce, this.cookie, id)
      .subscribe((data :any) => {
        for(let post of data.response.posts){
          this.posts.push(post);
        }
        this.posts = this.wordpressService.parseTextLang(this.posts, this.lang);
      });

  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.posts = [];
    let oldPosts = [];
    this.wordpressService.getRecentPosts(this.nonce, this.cookie )
      .subscribe((data :any) => {
        for(let post of data.response.posts){
          oldPosts.push(post);
        }

        oldPosts = this.wordpressService.parseTextLang(oldPosts, this.lang);

        for(let i = 0; i < oldPosts.length; i++){
          if(oldPosts[i].category_name == this.recepts){
            this.posts.push(oldPosts[i]);
          }
        }
      });
    setTimeout(() => {
      console.log('Async operation has ended');
      refresher.complete();
    }, 2000);
  }

}
