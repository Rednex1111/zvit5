import {Component} from '@angular/core';
import {ToastOptions, Toast, NavController, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {WordpressService} from "../../providers/wordpress.service";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
/*import {InfoEnterprisesPage} from "../info-enterprises/info-enterprises";*/
import {TranslateService} from "@ngx-translate/core";


@Component({
    selector: 'page-enterprises',
    templateUrl: 'enterprises.html',
})
export class EnterprisesPage {
    NoDataYet: boolean;
    companies: Array<any> = new Array<any>();
    data_of_company: any;
    toastOption: ToastOptions;
    toastOk: ToastOptions;
    toastErr: ToastOptions;
    Enterprise_translate: any;
    lang: string;
    noData = false;

    constructor(public navCtrl: NavController,
                public toast: ToastController,
                public translate: TranslateService,
                public alertCtrl: AlertController,
                public loadingCtrl: LoadingController,
                public WPService: WordpressService,
                public AuthenticationService: AuthenticationServiceProvider) {

    }

    ionViewDidLoad() {
        this.AuthenticationService.getUserLang()
            .then(res => {
                if (!res) {
                    this.lang = 'ru';
                    this.loadEnterprise(this.lang);
                } else {
                    this.lang = res.language;
                    this.loadEnterprise(this.lang);
                }
            });
    }

    loadEnterprise(lang){
        this.Enterprise_translate = this.translate.store.translations[`${this.lang}`].Enterprises;

        this.translate.get('EnterprisesPage',this.lang).subscribe(
            res =>{
                document.getElementById('title_page').innerText = res;
            });
        this.NoDataYet = false;
        this.AuthenticationService.getUser().then(
            data => {
                if (data) {
                    if (!(this.companies.length > 0)) {
                        let loading = this.loadingCtrl.create({
                            spinner: 'bubbles'
                        });
                        loading.present();
                        this.WPService.getCompanies(data.user_id, data.nonce, data.cookie)
                            .subscribe((res: any) => {
                                if (res.response.companies) {
                                    this.noData = false;
                                    this.data_of_company = res.response.companies;
                                    this.initializeCompany(this.data_of_company);
                                    loading.dismiss();
                                } else {
                                    this.noData = true;
                                    loading.dismiss();
                                }
                            })
                    }
                } else {
                    console.log('no data');
                }

            }, error => {
                console.log(error)
            }
        )
    }

    initializeCompany(data){
            for (let company of data) {
                this.companies.push(company);
            }
    }

    addCompany() {
        this.toastOption = {
            message: this.Enterprise_translate.toastOption,
            duration: 3000
        };

        let alert = this.alertCtrl.create({
            title: this.Enterprise_translate.addCompany,
            inputs: [
                {
                    name: 'name_company',
                    placeholder: this.Enterprise_translate.nameCompany
                },
                {
                    name: 'mfo_company',
                    placeholder: 'ОКПО'
                }
            ],
            buttons: [
                {
                    text: this.Enterprise_translate.btn_cancel,
                    role: 'cancel',
                    handler: data => {
                        console.log('Cancel clicked');
                    }
                },
                {
                    text: this.Enterprise_translate.btn_ok,
                    handler: data_company => {
                        if (data_company.name_company!=='' && data_company.mfo_company!=='') {
                            this.AuthenticationService.getUser().then(
                                data => {
                                    if (data) {
                                        this.WPService.createCompany(data.user_id, data.nonce,
                                            data.cookie, data_company.name_company, data_company.mfo_company)
                                            .subscribe((res: any) => {
                                                if(res.status === 'ok'){
                                                    this.toastOk = {
                                                    message: this.Enterprise_translate.toastOk,
                                                    duration: 2000
                                                };
                                                    this.toast.create(this.toastOk).present();
                                                    let company = {title: data_company.name_company, company_id: res.response.company_id};
                                                    this.companies.push(company);
                                                    this.noData = false;
                                                }
                                            }, error =>{
                                                    this.toastErr = {
                                                        message: this.Enterprise_translate.toastErr,
                                                        duration: 3000
                                                    };
                                                    this.toast.create(this.toastErr).present();
                                            })
                                    }
                                });
                        } else {
                            this.toast.create(this.toastOption).present();
                            return false;
                        }
                    }
                }
            ]
        });
        alert.present();
    }

    infoTapped(company) {
        /*this.navCtrl.push(InfoEnterprisesPage, {
            company_id: company.company_id,
            name: company.title
        });*/
    }

    search_company(event: any) {
       this.companies = this.data_of_company;
        let searchVal = event.target.value;
        if (searchVal && searchVal.trim() != '') {
            this.companies = this.companies.filter((company) => {
                return (company.title.toLowerCase().indexOf(searchVal.toLowerCase()) > -1);
            })
        }
    }
}
