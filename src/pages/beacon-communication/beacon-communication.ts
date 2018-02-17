import {Component} from '@angular/core';
import {ToastController, ToastOptions, LoadingController, NavController} from 'ionic-angular';
import {WordpressService} from "../../providers/wordpress.service";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {NewsPage} from "../news/news";


@Component({
    selector: 'page-beacon-communication',
    templateUrl: 'beacon-communication.html',
})
export class BeaconCommunicationPage {
    toastOption: ToastOptions;
    toastOptionErr: ToastOptions;

    companies: Array<any> = new Array<any>();
    msg: string;
    data_user = {
        cookie: '',
        nonce: ''
    };
    email_info = {
        email: '',
        subject: '',
        message: ''
    };

    constructor(public navCtrl: NavController,
                public loadingCtrl: LoadingController,
                public toast: ToastController,
                public WPService: WordpressService,
                public AuthService: AuthenticationServiceProvider) {

        this.toastOption = {

        };
        this.toastOptionErr = {
            message: 'Заполните пожалуйста все поля',
            duration: 3000
        };
    }

    ionViewDidLoad() {
        this.AuthService.getUser()
            .then(data => {
                this.data_user.cookie = data.cookie;
                this.data_user.nonce = data.nonce;
                this.WPService.getCompanies(data.user_id, data.cookie)
                    .subscribe((res:any) => {
                        if (res.response.length <= 0) {
                            console.log('no data');
                        }else {
                            for (let company of res.response.companies) {
                                this.companies.push(company);
                            }
                        }
                    });
            });
    }

    send() {
        let toastOk =  this.toast.create({
            message: 'Сообщение успешно отправлено!',
         //   duration: 3000,
            showCloseButton: true,
            closeButtonText: "Ok"
        });

        let loading = this.loadingCtrl.create({
            spinner: 'bubbles'
        });

        this.email_info.message = this.msg;
        if (!this.msg || !this.email_info.email || !this.email_info.subject) {
           //let toast =  this.toast.create(this.toastOptionErr).present();
        } else {
            loading.present();
            this.WPService.sendMail(this.data_user, this.email_info)
                .subscribe((res :any)=> {
                    if (res.response.status) {
                        toastOk.present();
                        toastOk.onDidDismiss((data, role) => {
                            if (role == 'close') {
                                this.navCtrl.setRoot(NewsPage);
                            }
                        });

                        //this.toast.create(this.toastOption).present();
                        loading.dismiss();
                    }
                });
        }
    }

    selectCompany(value) {
        this.email_info.subject = value;
    }

    selectEmail(value) {
        this.email_info.email = value;
    }

}
