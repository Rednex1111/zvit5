import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders } from '@angular/common/http';
import {Storage} from '@ionic/storage';
import 'rxjs/add/operator/map';
import * as Config from '../../config';


@Injectable()
export class AuthenticationServiceProvider {

  constructor(public storage: Storage, public http: HttpClient) {}


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

  setUserLang(lang){
    return this.storage.set('UserLang', lang);
  }

  getUserLang(){
    return this.storage.get('UserLang');
  }

  logOut() {
    return this.storage.remove('User');
  }

  getNonce() {
    return this.http.get(Config.WORDPRESS_NONCE);
  }



  doLogin(username, password){
    return this.http.get(Config.LOGIN +
      '?username='+username +
      '&password='+ password +
      '&insecure='+ 'cool')
      .map(res => res);
  }

  doRegister(displayName, email, password, number, token) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type':  'application/json',
        "Authorization": "Bearer " + token
      })
    };
 /*   let header = new Headers({"Authorization": "Bearer " + token});
    let options = new RequestOptions({headers: header});*/
    return this.http.post(Config.REGISTER, {
      username: email,
      name: displayName,
      email: email,
      password: password,
      description: number
    }, httpOptions)
  }

}
