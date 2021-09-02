import {Component} from '@angular/core';
import {
  ToastOptions, LoadingController, NavController, NavParams, AlertController,
  ToastController
} from 'ionic-angular';
import {WordpressService} from "../../providers/wordpress.service";
import {AuthenticationServiceProvider} from "../../providers/authentication-service/authentication-service";
import {EnterprisesPage} from "../enterprises/enterprises";
import {TranslateService} from "@ngx-translate/core";

@Component({
  selector: 'page-good-info',
  templateUrl: 'good-info.html',
})
export class GoodInfoPage {
  toastOption: ToastOptions;
  Goods_translate: any;
  lang = 'uk';
  product_id: number;
  NoProductYet: boolean;
  products = [];
  companies: Array<any> = new Array<any>();
  order = {
    nonce: '',
    cookie: '',
    user_id: '',
    product_id: 0,
    company_id: '',
    product: [{
      name: '',
      term: '',
      price: ''
    }]
  };

  constructor(public navCtrl: NavController,
              public toast: ToastController,
              public loadingCtrl: LoadingController,
              public navParams: NavParams,
              public translate: TranslateService,
              public alertCtrl: AlertController,
              public WPService: WordpressService,
              public AuthService: AuthenticationServiceProvider) {
    this.AuthService.getUserLang()
      .then(res => {
        if (!res) {
          this.lang = 'uk';
          this.Load();
        } else {
          this.lang = res.language;
          this.Load();
        }
      });
  }

  Load() {
    console.log(this.lang);
    this.Goods_translate = this.translate.store.translations[this.lang].Good_info;
    this.NoProductYet = false;
    this.product_id = this.navParams.get('product_id');
    this.AuthService.getUser()
      .then(data => {
        this.order.nonce = data.nonce;
        this.order.cookie = data.cookie;
        this.order.user_id = data.user_id;
        this.order.product_id = this.product_id;

        let loading = this.loadingCtrl.create({
          spinner: 'bubbles'
        });
        loading.present();
        if (data) {
          this.WPService.getProductInfo(this.product_id, data.nonce, data.cookie)
            .subscribe((res: any) => {
              if (res.response.prices.length > 0) {
                for (let product of res.response.prices) {
                  this.products.push(product)
                }
                console.log((this.products));

                loading.dismiss();
                this.WPService.getCompanies(data.user_id, data.cookie)
                  .subscribe((res: any) => {
                    if (res.response.length <= 0) {
                      console.log('no company');
                    } else {
                      for (let company of res.response.companies) {
                        this.companies.push(company);
                      }
                    }
                  },err => {
                    loading.dismiss();
                    console.log(JSON.stringify(err));
                  });
              } else {
                this.NoProductYet = true;
                loading.dismiss();
              }
            })
        }
      });
  }

  selectProduct(product) {
    this.deleteProd();

    let check = document.getElementById(product.id + 'select');
    let prod_select = document.getElementById(product.id);

    prod_select.className += ' choose';
    check.className += ' check_prod_select';

    let term = this.endLicense(product.term);

    this.order.product[0].name = product.name;
    this.order.product[0].term = term || null;
    this.order.product[0].price = product.price;
  }

  deleteProd() {
    let dismiss_all = document.getElementsByClassName('choose');
    let select_ell = document.getElementsByClassName('check_prod');

    for (let i = 0; i < dismiss_all.length; i++) {
      dismiss_all[i].classList.remove('choose');
    }
    for (let i = 0; i < select_ell.length; i++) {
      select_ell[i].classList.remove('check_prod_select');
    }
  }

  selectCompany(selected_value) {
    this.order.company_id = selected_value;
  }

  sendOrder() {
    this.toastOption = {
      message: this.Goods_translate.send_order_email,
      duration: 3000
    };

    if (!this.order.company_id || !this.order.product[0].name) {
      let alert = this.alertCtrl.create({
        title: 'Oops!',
        subTitle: this.Goods_translate.warn,
        buttons: ['OK'],
        cssClass: 'alerterr'
      });
      alert.present();

    } else {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles'
      });
      loading.present();
      this.WPService.addProductToCompany(this.order)
        .subscribe((res: any) => {
          if (res.status === 'ok') {
            this.navCtrl.setRoot(EnterprisesPage);
            this.toast.create(this.toastOption).present();
            loading.dismiss();
          }
        },err => {
          loading.dismiss();
          console.log(JSON.stringify(err));
        });
    }
  }

  endLicense(count) {
    if (count !== '') {
      let date_now = new Date();
      let end_date = new Date(new Date(date_now).setMonth(date_now.getMonth() + Number(count)));

      var dd = end_date.getDate() + '';
      var mm = end_date.getMonth() + 1 + '';

      let yyyy = end_date.getFullYear();

      if (Number(dd) < 10) {
        dd = '0' + dd;
      }
      if (Number(mm) < 10) {
        mm = '0' + mm;
      }

      console.log('date= ' + dd + '.' + mm + '.' + yyyy);
      return dd + '.' + mm + '.' + yyyy;
    } else {
      return '';
    }

  }
}
