import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, NavController, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {AuthenticationServiceProvider} from '../../providers/authentication-service/authentication-service';
import {EnterprisesPage} from "../enterprises/enterprises";
import {Sim} from '@ionic-native/sim';
import {FCM} from "@ionic-native/fcm";
import {WordpressService} from "../../providers/wordpress.service";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-register',
  templateUrl: 'register.html'
})
export class RegisterPage {
  register_form: FormGroup;
  nonce: string;
  token: string;
  numberPhone: string;
  email:string;
  code;
  displayName:'';
  error_message: string;
  device_token: string;
  newCode;
  public codeSended = false;

  constructor(public navCtrl: NavController,
              private sim: Sim,
              public loadingCtrl: LoadingController,
              public alertCtrl: AlertController,
              public fcm: FCM,
              public platform: Platform,
              public authenticationService: AuthenticationServiceProvider,
              public WPService: WordpressService,
              public formBuilder: FormBuilder,
              public toastCtrl: ToastController,
              private translate: TranslateService) {
    this.platform.ready()
      .then(() => {
        this.getSimData();
      })
  }

  ionViewWillLoad() {
    this.fcm.getToken().then(token => {
        this.device_token = token;
      }
    );

    if(!localStorage.getItem('code')) {
      this.newCode = Math.floor(1000 + Math.random() * 9000);
      localStorage.setItem('code', JSON.stringify(this.newCode));
    } else {
      this.newCode = Number(localStorage.getItem('code'));
    }

    console.log('CODE: ', this.newCode);

    this.authenticationService.getToken().subscribe((res: any) => {
      this.token = res.token;
    });
    /*this.authenticationService.getNonce().subscribe((res: any) => {
        this.nonce = res.json().nonce;
    });*/
    this.register_form = this.formBuilder.group({
      numberPhone: new FormControl(this.numberPhone, Validators.required),
      code: new FormControl(this.code),
      displayName: new FormControl(this.displayName, Validators.required),
      email: new FormControl(this.email, Validators.required),
    });
  }

  onSubmit(values) {
    let loading = this.loadingCtrl.create();
    loading.present();

    if (!this.validateEmail(values.email)) {
      this.translate.get('Register.invalid_email')
        .subscribe(res => {
          loading.dismiss();
          this.presentToast(res);
        });
      return;
    }

    if (!this.codeSended) {
      this.authenticationService.sendSMS(values.numberPhone, this.newCode)
        .subscribe(res => {
          if(res == 200){
            loading.dismiss();
            this.codeSended = true;
          }
        }, (error) => {
          loading.dismiss();
          this.error_message = "Неверный код подтверждения";
        })
    } else {
      if (this.code == this.newCode) {
        this.authenticationService.doRegister(
          values.displayName,
          values.email,
          values.numberPhone)
          .subscribe(
            res => {
              if (res == 200) {
                this.authenticationService.doLogin(values.displayName, values.numberPhone)
                  .subscribe((res: any) => {
                    console.log(res);
                    localStorage.setItem('phone', values.numberPhone);
                    let cookie = res.response.cookie;
                    let user_id = res.response.user_id;
                    this.authenticationService.setUser({
                      nonce: this.nonce,
                      cookie: res.response.cookie,
                      user_id: res.response.user_id,
                    });
                    let device_platform;
                    this.platform.is('android') ? device_platform = 'android' : device_platform = 'ios';
                    this.WPService.sendDeviceToken(user_id, cookie, this.nonce, this.device_token, device_platform)
                      .subscribe((res: any) => {
                        console.log('status= ' + res.status);
                      });

                    loading.dismiss();
                    this.navCtrl.setRoot(EnterprisesPage);
                  });
              } else if (res == 440) {
                loading.dismiss();
                this.translate.get('Register.data_present')
                  .subscribe(res => {
                    this.presentToast(res);
                    return;
                  })
              } else {
                loading.dismiss();
                this.translate.get('Register.invalid_reg')
                  .subscribe(res => {
                    this.presentToast(res);
                    return;
                  })
              }

            },
            (error: any) => {
              loading.dismiss();
              let alert = this.alertCtrl.create({
                title: 'Oops!',
                subTitle: '',
                buttons: ['OK'],
                cssClass: 'alerterr'
              });
              alert.present();

              console.log(JSON.stringify(error));

            }
          );
      } else {
        this.translate.get('Register.InvalidCode')
          .subscribe(res => {
            loading.dismiss();
            this.presentToast(res);
            return;
          })
      }


    }

  }

  phoneNumberCheck(phone) {
    let pNumber = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{2})[-.]?([0-9]{2})$/;
    if (phone.match(pNumber)) {
      return true;
    } else {
      return false;
    }
  }

  async getSimData() {
    try {
      let simPermission = await this.sim.requestReadPermission();
      if (simPermission == "OK") {
        let simData = await this.sim.getSimInfo();
        this.numberPhone = simData.phoneNumber;
      }
    } catch (error) {
      console.log(error);
      this.getSimData();
    }
  }

  validateEmail(email) {
    let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    console.log(re.test(email));
    return re.test(email);
  }

  presentToast(message) {
    let toast = this.toastCtrl.create({
      message: message,
      showCloseButton: true,
      closeButtonText: "Ok",
      position: 'bottom'
    });
    toast.present();
  }

}
