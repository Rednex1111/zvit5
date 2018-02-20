import {Component} from '@angular/core';
import {ToastOptions, ToastController, NavController, NavParams, AlertController} from 'ionic-angular';
import {WordpressService} from "../../providers/wordpress.service";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {EnterprisesPage} from "../enterprises/enterprises";
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-info-enterprises',
    templateUrl: 'info-enterprises.html',
})
export class InfoEnterprisesPage {
    company_id: any;
    company_info = [];
    company_info_date = [];
    toastOption: ToastOptions;
    toastRename: ToastOptions;
    title: string;
    cookie: string;
    lang: string;
    translate_infoEnterpise: any;
    private storedScroll: number = 0;
    private threshold: number = 5;


    constructor(public navCtrl: NavController,
                public toast: ToastController,
                public translate: TranslateService,
                public navParams: NavParams,
                public alertCtrl: AlertController,
                public Auth: AuthenticationServiceProvider,
                public WPservis: WordpressService) {
    }

    ionViewDidLoad() {
        this.lang = this.translate.getDefaultLang();
        this.title = this.navParams.get('name');
        this.company_id = this.navParams.get('company_id');
        this.translate_infoEnterpise = this.translate.store.translations[`${this.lang}`].Info_Enterprises;

        this.Auth.getUser().then(
          (res: any)=> {
                this.cookie = res.cookie;
                this.WPservis.getCompanyInfo(res, this.company_id).subscribe((res: any) => {
                    for (let info in res.response.products) {
                        this.company_info.push(res.response.products[info]);
                    }

                    for (let info in res.response.date) {
                        let term = {name: '', term: ''};
                        if(res.response.date[info] !== null){
                          term.name = info;
                          term.term = res.response.date[info];
                          this.company_info_date.push(term);
                        }
                    }
                })
            },
            error => {
                console.log(error);
            }
        );
    }

    deleteCompany() {
        this.toastOption = {
            message: this.translate_infoEnterpise.toastOption,
            duration: 3000
        };

        let alert_ms = this.alertCtrl.create({
            title: this.translate_infoEnterpise.alert_ms_title,
            buttons: [
                {
                    text: this.translate_infoEnterpise.btn_cancel,
                    role: 'cancel'
                },
                {
                    text: 'Ok',
                    handler: data_company => {
                        this.Auth.getUser().then(
                            user => {
                                this.WPservis.deleteCompany(user, this.company_id)
                                    .subscribe(res => {
                                        this.navCtrl.setRoot(EnterprisesPage);
                                        this.toast.create(this.toastOption).present();
                                    });
                            })
                    }
                }]
        });
        alert_ms.present();

    }

    renameCompany() {

        this.toastRename = {
            message: this.translate_infoEnterpise.toastRename,
            duration: 3000
        };
        let alert_ms = this.alertCtrl.create({
            title: this.translate_infoEnterpise.alert_new_title,
            inputs: [
                {
                    name: 'name_company',
                    placeholder: this.title
                }],
            buttons: [
                {
                    text: this.translate_infoEnterpise.btn_cancel,
                    role: 'cancel'
                },
                {
                    text: 'Ok',
                    handler: data_company => {
                        if (data_company.name_company !== '') {
                            this.WPservis.renameCompany(this.company_id, this.cookie, data_company.name_company)
                                .subscribe((res: any) => {
                                    if (res.status == 'ok') {
                                        this.title = data_company.name_company;
                                        this.toast.create(this.toastRename).present();
                                    }
                                });
                        } else {
                            console.log('err');
                            return false;
                        }
                    }
                }
            ]
        });
        alert_ms.present();
    }

    public scrollFunction = (event: any) => {
        if (event.scrollTop - this.storedScroll > this.threshold) {
           // console.log("Scrolling down");
            document.getElementById('btn_fab').style.display = 'none';
      } else if (event.scrollTop - this.storedScroll < 0) {
          //  console.log("Scrolling up");
            document.getElementById('btn_fab').style.display = 'block';
      }
       // console.log(event.scrollTop);
        this.storedScroll = event.scrollTop;
    }
}
