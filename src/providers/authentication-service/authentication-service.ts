import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';
import * as Config from '../../config';
import {Md5} from "ts-md5";
import {Http, Headers} from "@angular/http";


@Injectable()
export class AuthenticationServiceProvider {

  constructor(public storage: Storage, public http: HttpClient, public oldHttp: Http) {}


  getToken(){
    return this.http.post(Config.GET_TOKEN, {
      username: 'admin',
      password: 'awdasd',
      insecure: 'cool'
    })
  }

  setUser(user) {
    return this.storage.set('User', user);
  }

  getUser() {
    return this.storage.get('User');
  }

  setUserCode(code) {
    return this.storage.set('code', code);
  }

  getUserCode() {
    return this.storage.get('code');
  }

  setUserLang(lang){
    return this.storage.set('UserLang', lang);
  }

  getUserLang(){
    return this.storage.get('UserLang');
  }

  setUserPhoneNumber(phoneNumber) {
    return this.storage.set('phone', phoneNumber);
  }

  getUserPhoneNumber() {
    return this.storage.get('phone');
  }

  logOut() {
    return this.storage.remove('User');
  }

  getNonce() {
    return this.http.get(Config.WORDPRESS_NONCE);
  }



  doLogin(username, password){
    return this.http.get(Config.LOGIN +
      '?username='+ password.toString() +
      '&password='+ password.toString() +
      '&insecure='+ 'cool')
      .map(res => res);
  }

  doRegister(displayName, email, phoneNumber) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let key = "HDJh9838y78yoUIGDJJDHBOdfijodh9838";
    let action = 'reg';
    let hash = Md5.hashStr(action + email + key);
    let params = `action=${action}&name=${displayName}&email=${email}&phone=${encodeURIComponent(phoneNumber)}&sign=${hash}`;
    let url = `${Config.SITE_URL}/reg_app.php`;

    return this.oldHttp.post(url, params, {headers: headers})
      .map(data => data.json())
  }

  sendSMS(phoneNumber, code) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let key = "HDJh9838y78yoUIGDJJDHBOdfijodh9838";
    let action = 'send';
    let hash = Md5.hashStr(action + code + key);
    let params = `action=${action}&code=${code}&phone=${encodeURIComponent(phoneNumber)}&sign=${hash}`;
    let url = `${Config.SITE_URL}/send_sms.php`;

    return this.oldHttp.post(url, params, {headers: headers})
      .map(data => data.json())
  }

}
