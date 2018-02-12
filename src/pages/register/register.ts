import {Component} from '@angular/core';
import 'rxjs/add/operator/map';
import {Platform, NavController, LoadingController, AlertController} from 'ionic-angular';
import {Validators, FormBuilder, FormGroup, FormControl} from '@angular/forms';
import {AuthenticationServiceProvider} from '../../providers/authentication-service/authentication-service';
import { EnterprisesPage } from "../enterprises/enterprises";
/*import { Sim } from '@ionic-native/sim';
import { FCM } from "@ionic-native/fcm";*/
import { WordpressService } from "../../providers/wordpress.service";


@Component({
    selector: 'page-register',
    templateUrl: 'register.html'
})
export class RegisterPage {
    register_form: FormGroup;
    nonce: string;
    token: string;
    numberPhone: string;
    error_message: string;
    device_token: string;
    constructor(public navCtrl: NavController,
                //private sim: Sim,
                public loadingCtrl: LoadingController,
                public alertCtrl: AlertController,
                //public fcm: FCM,
                public platform: Platform,
                public authenticationService: AuthenticationServiceProvider,
                public WPService: WordpressService,
                public formBuilder: FormBuilder) {
    }

    ionViewWillLoad() {
        /*this.fcm.getToken().then(token => {
                this.device_token = token;
                console.log(token);
            }
        );

        this.sim.getSimInfo().then(
            (info) => {
                var re = /"/gi;
                this.numberPhone = JSON.stringify(info.phoneNumber).replace(re,'');
            },
            (err) => console.log('Unable to get sim info: ' + JSON.stringify(err))
        );*/

       this.authenticationService.getToken().subscribe((res: any)=> {
         console.log(res.token);
            this.token = res.token;
        });
        /*this.authenticationService.getNonce().subscribe((res: any) => {
            this.nonce = res.json().nonce;
        });*/
        this.register_form = this.formBuilder.group({
            password: new FormControl('', Validators.required),
            repeatPassword: new FormControl('', Validators.required),
            displayName: new FormControl('', Validators.required),
            email: new FormControl('', Validators.required),
        });
    }

    onSubmit(values) {

        let loading = this.loadingCtrl.create();
        loading.present();

        if(values.password === values.repeatPassword){
            this.authenticationService.doRegister(
                values.displayName,
                values.email,
                values.password,
                this.numberPhone,
                //this.nonce,
                this.token)
                .subscribe(
                    res => {
                        this.authenticationService.doLogin(values.email, values.password)
                            .subscribe((res: any) => {
                                let cookie =  res.response.cookie;
                                let user_id = res.response.user_id;
                                this.authenticationService.setUser({
                                    nonce:  this.nonce,
                                    cookie: res.response.cookie,
                                    user_id: res.response.user_id
                                });
                                let device_platform;
                                this.platform.is('android') ? device_platform ='android': device_platform ='ios';
                                this.WPService.sendDeviceToken(user_id, cookie, this.nonce, this.device_token,  device_platform)
                                    .subscribe( (res: any) => {
                                        console.log('status= '+ res.status);
                                    });

                                loading.dismiss();
                                this.navCtrl.setRoot(EnterprisesPage);
                            });
                    },
                  (error: any) => {
                        let alert = this.alertCtrl.create({
                            title: 'Oops!',
                            subTitle: '',
                            buttons: ['OK'],
                            cssClass: 'alerterr'
                        });
                        alert.present();
                        loading.dismiss();
                    }
                )
        }else {
            loading.dismiss();
            this.error_message = "пароли не совпадают";
        }

    }

}
