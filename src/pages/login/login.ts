import { Component } from '@angular/core';
import { NewsPage } from "../news/news";
import { Platform, NavController, LoadingController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordpressService } from '../../providers/wordpress.service';
import { AuthenticationServiceProvider } from '../../providers/authentication-service/authentication-service';
import { FCM } from "@ionic-native/fcm";


@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  login_form: FormGroup;
  error_message: string;
  nonce: string;
  cookie: string;
  user_id: string;
  device_token: string;
  device_platform: string;
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public WPService: WordpressService,
    public fcm: FCM,
    public authenticationService: AuthenticationServiceProvider
  ) {}

  ionViewWillLoad() {
    /*this.authenticationService.getNonce().
    subscribe(res =>{
      this.nonce = res.json().nonce;
    });*/
    this.login_form = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      password: new FormControl('', Validators.required)
    });

    this.fcm.getToken().then(token => {
        this.device_token = token;
      }
    );
  }

  login(value){
    let loading = this.loadingCtrl.create();
    loading.present();

    this.authenticationService.doLogin(value.username, value.password)
      .subscribe((res:any) => {
          this.cookie = res.response.cookie;
          this.user_id = res.response.user_id;
          this.authenticationService.setUser({
            cookie: res.response.cookie,
            user_id: res.response.user_id,
            device_token: this.device_token
          });

          this.platform.is('android') ? this.device_platform ='android':this.device_platform ='ios';
          this.WPService.sendDeviceToken(this.user_id, this.cookie, this.nonce, this.device_token,  this.device_platform)
            .subscribe( (res:any)=> {
              console.log('status= '+ res.status);
            });
          this.navCtrl.setRoot(NewsPage);

          loading.dismiss();
        },
        err => {
          loading.dismiss();
          this.error_message = "Invalid credentials.";
          console.log(err);
        })
  }

}
