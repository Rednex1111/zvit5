import {Component} from '@angular/core';
import {ToastOptions, NavController, LoadingController, AlertController, ToastController} from 'ionic-angular';
import {WordpressService} from "../../providers/wordpress.service";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {InfoEnterprisesPage} from "../info-enterprises/info-enterprises";
import {TranslateService} from "@ngx-translate/core";


@Component({
  selector: 'page-enterprises',
  templateUrl: 'enterprises.html',
})
export class EnterprisesPage {
  companies: Array<any> = new Array<any>();
  data_of_company: any;
  toastOption: ToastOptions;
  toastOk: ToastOptions;
  toastErr: ToastOptions;
  Enterprise_translate: any;
  Enterprise_info: any;
  lang: string;
  noData = false;
  isCompaniesToDelete = false;

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
          this.lang = 'uk';
          this.loadEnterprise();
        } else {
          this.lang = res.language;
          this.loadEnterprise();
        }
      });
  }

  loadEnterprise() {

    this.Enterprise_translate = this.translate.store.translations[this.lang].Enterprises;
    this.Enterprise_info = this.translate.store.translations[this.lang].Info_Enterprises;
    this.getCompanies();
  }

  getCompanies() {
    this.AuthenticationService.getUser().then(
      data => {
        let loading = this.loadingCtrl.create({
          spinner: 'bubbles'
        });
        if (data) {
          loading.present();
          this.WPService.getCompanies(data.user_id, data.cookie)
            .subscribe((res: any) => {
              if (res.response.companies) {
                this.data_of_company = [];
                this.noData = false;
                // alert(JSON.stringify(res.response.companies));
                this.data_of_company = res.response.companies;
                this.initializeCompany(res.response.companies);
                loading.dismiss();
              } else {
                this.noData = true;
                this.companies = [];
                loading.dismiss();
              }
            },err => {
              loading.dismiss();
              console.log(JSON.stringify(err));
            })
        } else {
          console.log('no data');
          loading.dismiss();
        }

      },
      error => {
        console.log(error)
      }
    )
  }

  initializeCompany(data) {
    this.companies = [];
    this.translate.get('EnterprisesPage', this.lang).subscribe(
      res => {
        document.getElementById('title_page').innerText = res;
      });
    for (let company of data) {
      this.companies.push(company);
    }

    for (let i = 0; i < this.companies.length; i++) {
      this.companies[i].chosen = false;
      this.companies[i].tapped = false;
    }
  }

  addCompany() {

    let alert = this.alertCtrl.create({
      title: this.Enterprise_translate.addCompany,
      inputs: [
        {
          name: 'name_company',
          placeholder: this.Enterprise_translate.nameCompany
        },
        {
          name: 'mfo_company',
          placeholder: 'ОКПО',
          type: 'number',
          max: 10
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
            if (data_company.name_company !== '' && data_company.mfo_company !== '') {
              console.log(this.validateMFO(data_company.mfo_company));
              if (this.validateMFO(data_company.mfo_company)) {
                this.toastOption = {
                  message: this.Enterprise_translate.numberLength,
                  showCloseButton: true,
                  closeButtonText: "Ok"
                };
                this.toast.create(this.toastOption).present();
                return false;
              } else {
                this.AuthenticationService.getUser().then(
                  data => {
                    if (data) {
                      this.WPService.createCompany(data.user_id, data.nonce,
                        data.cookie, data_company.name_company, data_company.mfo_company)
                        .subscribe((res: any) => {
                          if (res.status === 'ok') {
                            this.toastOk = {
                              message: this.Enterprise_translate.toastOk,
                              showCloseButton: true,
                              closeButtonText: "Ok"
                            };
                            this.toast.create(this.toastOk).present();
                            let company = {title: data_company.name_company, company_id: res.response.company_id};
                            this.companies.push(company);
                            this.noData = false;
                          }
                        }, error => {
                          this.toastErr = {
                            message: this.Enterprise_translate.toastErr,
                            showCloseButton: true,
                            closeButtonText: "Ok"
                          };
                          this.toast.create(this.toastErr).present();
                        })
                    }
                  });
              }

            } else {
              this.toastOption = {
                message: this.Enterprise_translate.toastOption,
                showCloseButton: true,
                closeButtonText: "Ok"
              };
              this.toast.create(this.toastOption).present();
              return false;
            }
          }
        }
      ]
    });
    alert.present();
  }

  deleteCompanies() {
    let companiesToDelete:string = '';
    this.companies.forEach((company, index) => {
      if (company.chosen) {
        companiesToDelete += company.company_id + ',';
      }
    });

    console.log(companiesToDelete);
    if (companiesToDelete !== '') {
      companiesToDelete = companiesToDelete.replace(/.$/, '');

      console.log(companiesToDelete);
      this.toastOption = {
        message: this.Enterprise_info.toastOption,
        showCloseButton: true,
        closeButtonText: "Ok"
      };

      let alert_ms = this.alertCtrl.create({
        title: this.Enterprise_info.alert_ms_title,
        buttons: [
          {
            text: this.Enterprise_info.btn_cancel,
            role: 'cancel'
          },
          {
            text: 'Ok',
            handler: data_company => {
              this.AuthenticationService.getUser().then(
                user => {
                  this.WPService.deleteCompany(user, companiesToDelete, 1)
                    .subscribe(res => {
                      this.getCompanies();
                      this.toast.create(this.toastOption).present();
                    });
                })
            }
          }]
      });
      alert_ms.present();
    } else {
      this.toastOption = {
        message: this.Enterprise_translate.nothingDelete,
        showCloseButton: true,
        closeButtonText: "Ok"
      };
      this.toast.create(this.toastOption).present();
      return false;
    }
  }

  validateMFO(value) {
    return value.toString().length > 10;
  }

  infoTapped(company) {
    console.log(company);
    this.navCtrl.push(InfoEnterprisesPage, {
      company_id: company.company_id,
      name: company.title
    });
  }

  chooseCompany(id) {
    this.companies[id].tapped = !this.companies[id].tapped;
    this.companies[id].chosen = !this.companies[id].chosen;
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
