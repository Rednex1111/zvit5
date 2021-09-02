import { Component } from '@angular/core';
import { NewsPage } from "../news/news";
import {Platform, NavController, LoadingController, ToastController, AlertController} from 'ionic-angular';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { WordpressService } from '../../providers/wordpress.service';
import { AuthenticationServiceProvider } from '../../providers/authentication-service/authentication-service';
import { FCM } from "@ionic-native/fcm";
import {Sim} from "@ionic-native/sim";
import {EnterprisesPage} from "../enterprises/enterprises";
import {TranslateService} from "@ngx-translate/core";
import {RegisterPage} from "../register/register";


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
  phoneNumber:string;
  code:number;
  codeSended = false;
  newCode:number;
  constructor(
    public navCtrl: NavController,
    public platform: Platform,
    public loadingCtrl: LoadingController,
    public formBuilder: FormBuilder,
    public WPService: WordpressService,
    public fcm: FCM,
    public authenticationService: AuthenticationServiceProvider,
    private sim: Sim,
    private translate: TranslateService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController
  ) {
    this.platform.ready()
      .then(() => {
        this.getSimData();
      })
  }

  ionViewWillLoad() {
    /*this.authenticationService.getNonce().
    subscribe(res =>{
      this.nonce = res.json().nonce;
    });*/
    if(!localStorage.getItem('code')) {
      this.newCode = Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('code', JSON.stringify(this.newCode));
    } else {
      this.newCode = Number(localStorage.getItem('code'));
    }
    this.login_form = this.formBuilder.group({
      phoneNumber: new FormControl(this.phoneNumber, Validators.compose([
        Validators.required
      ])),
      code: new FormControl(this.code)
    });

    this.fcm.getToken().then(token => {
        this.device_token = token;
      }
    );
  }

  login(values){
    console.log(this.codeSended);
    let loading = this.loadingCtrl.create();
    loading.present();
    if (!this.codeSended) {
      this.authenticationService.sendSMS(values.phoneNumber, this.newCode)
        .subscribe(res => {
          console.log(res);
          if(res == 200){
            loading.dismiss();
            this.codeSended = true;
          } else if (res == 430) {
            this.codeSended = false;
            this.translate.get('Login.phone')
              .subscribe(phone => {
                loading.dismiss();
                this.presentToast(phone);
                return;
              })
          } else if (res == 450) {
            this.translate.get('Register.reg')
              .subscribe(res => {
                loading.dismiss();
                this.presentToast(res);
                return;
              })
          }
        }, (error) => {
          loading.dismiss();
          this.codeSended = true;
          this.translate.get('Register.reg')
            .subscribe(res => {
              loading.dismiss();
              this.presentToast(res);
              return;
            })
        })
    } else {
      if (this.code == this.newCode) {
        this.authenticationService.doLogin(values.displayName, values.phoneNumber)
          .subscribe((res: any) => {
            console.log(res);
              let cookie = res.response.cookie;
              let user_id = res.response.user_id;
              this.authenticationService.setUser({
                nonce: this.nonce,
                cookie: res.response.cookie,
                user_id: res.response.user_id,
              });
              localStorage.setItem('phone', values.phoneNumber);
              let device_platform;
              this.platform.is('android') ? device_platform = 'android' : device_platform = 'ios';
              this.WPService.sendDeviceToken(user_id, cookie, this.nonce, this.device_token, device_platform)
                .subscribe((res: any) => {
                  console.log('status= ' + res.status);
                });

              loading.dismiss();
              this.navCtrl.setRoot(EnterprisesPage);
          });
      } else {
        this.codeSended = false;
        this.translate.get('Register.reg')
          .subscribe(res => {
            loading.dismiss();
            this.presentToast(res, RegisterPage);
            return;
          })
      }


    }
  }

  presentToast(message, page?) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: "Ok",
      position: 'bottom'
    });
    toast.present();

    toast.onDidDismiss((data, role) => {
      if (role == 'close') {
        if (page) {
          this.navCtrl.push(page);
        }
      }
    })
  }

  async getSimData() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        console.log(simData);
        this.phoneNumber = simData.phoneNumber;
        console.log(this.phoneNumber);
      }
    } catch (error) {
      console.log(error);
      this.getSimData();
    }
  }

}
