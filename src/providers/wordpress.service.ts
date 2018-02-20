import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import * as Config from '../config';


@Injectable()
export class WordpressService {

    constructor(public http: HttpClient) {
    }

    getRecentPosts(nonce, cookie) {
        return this.http.get(
            Config.GET_POSTS
            + '?insecure=cool'
            + '&cookie=' + cookie/*, { headers: { 'Cache-Control' : 'no-cache'} }*/)
            .map(res => res);

    }

    getPostsById(nonce, cookie, category_id) {
        return this.http.get(
            Config.GET_POSTS_BY_ID +
            '?nonce=' + nonce +
            '&insecure=cool' +
            '&cookie=' + cookie +
            '&category_id=' + category_id,
          { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getPostData(nonce, cookie, post_id) {
        return this.http.get(Config.GET_POST + '?nonce=' + nonce
            + '&insecure=cool' + '&cookie=' + cookie + '&post_id=' + post_id,
          { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getProduct(nonce, cookie, id) {
        return this.http.get(Config.GET_PRODUCTS + '?nonce=' + nonce
            + '&insecure=cool' + '&cookie=' + cookie + '&group_id=' + id,
          { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getGroups(nonce, cookie) {
        return this.http.get(Config.GET_GROUPS + '?nonce=' + nonce
            + '&insecure=cool' + '&cookie=' + cookie
          ,{ headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getCompanies(user_id, cookie) {
      return this.http.get(Config.GET_COMPANIES
        + '?insecure=cool'
        + '&cookie=' + cookie
        + '&user_id=' + user_id, { headers: { 'Cache-Control' : 'no-cache' } });
    }

    createCompany(user_id, nonce, cookie, title, mfo) {
        return this.http.get(Config.CREATE_COMPANY + '?nonce=' + nonce
            + '&insecure=cool' + '&cookie=' + cookie + '&user_id=' + user_id +
            '&title=' + title + '&mfo=' + mfo,
          { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getProductInfo(product_id, nonce, cookie) {
        return this.http.get(Config.GET_PRODUCT_INFO + '?nonce=' + nonce
            + '&insecure=cool' + '&cookie=' + cookie + '&product_id=' + product_id
          , { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    addProductToCompany(data) {
        return this.http.get(Config.ADD_PRODUCT +
            '?nonce=' + data.nonce +
            '&insecure=' + 'cool' +
            '&cookie=' + data.cookie +
            '&product_id=' + data.product_id +
            '&user_id=' + data.user_id +
            '&company_id=' + data.company_id +
            '&product[name]=' + data.product[0].name +
            '&product[term]=' + data.product[0].term +
            '&product[price]=' + data.product[0].price,
          { headers: { 'Cache-Control' : 'no-cache' } }
        ).map(res => res);
    }

    getContactInfo(cookie) {
        return this.http.get(Config.GET_CONTACT_INFO +
          '?insecure=cool' +
          '&cookie=' + cookie +
          '&parent_id=' + Config.PARENT_ID_CONTACTS, { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getContactInfoById(id, cookie) {
        return this.http.get(Config.GET_CONTACT_INFO_BY_ID +
          '?insecure=cool' +
          '&cookie=' + cookie +
          '&post_id=' + id,
          { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getReferenceBook(cookie) {
        return this.http.get(Config.GET_REFERENCE_BOOK +
          '?insecure=cool' +
          '&cookie=' + cookie +
          '&parent_id=' + Config.PARENT_ID_REFERENCE, { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getReferenceBookById(id,cookie) {
        return this.http.get(Config.GET_REFERENCE_BOOK_BY_ID +
          '?insecure=cool' +
          '&cookie=' + cookie +
          '&post_id=' + id, { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    deleteCompany(user, company) {
        return this.http.get(Config.DELETE_COMPANY +
            '?nonce=' + user.nonce +
            '&insecure=cool' +
            '&cookie=' + user.cookie +
            '&user_id=' + user.user_id +
            '&company_id=' + company,
          { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    renameCompany(company_id, cookie, title){
        return this.http.get(Config.RENAME_COMPANY +
            '?insecure=cool' +
            '&cookie=' + cookie +
            '&company_id=' + company_id +
            '&title=' + title,
          { headers: { 'Cache-Control' : 'no-cache' } })
            .map(res => res);
    }

    getCompanyInfo(data, company_id) {
        return this.http.get(Config.GET_COMPANY_INFO +
            '?nonce=' + data.nonce +
            '&insecure=' + 'cool' +
            '&cookie=' + data.cookie +
            '&user_id=' + data.user_id +
            '&company_id=' + company_id,
          { headers: { 'Cache-Control' : 'no-cache' } }
        ).map(res => res);
    }

    sendMail(data_user, email_info) {
        return this.http.get(Config.SEND_MAIL +
            '?nonce=' + data_user.nonce +
            '&insecure=' + 'cool' +
            '&cookie=' + data_user.cookie +
            '&email=' + email_info.email +
            '&subject=' + email_info.subject +
            '&message=' + email_info.message,
          { headers: { 'Cache-Control' : 'no-cache' } }
        ).map(res => res);
    }

    sendDeviceToken(user_id, cookie, nonce, device_token, platform) {
        return this.http.get(Config.SEND_DEVICE_TOKEN +
            '?nonce=' + nonce +
            '&insecure=cool' +
            '&cookie=' + cookie +
            '&os_type=' + platform +
            '&token=' + device_token +
            '&user_id=' + user_id,
          { headers: { 'Cache-Control' : 'no-cache' } });
    }

    parseTextLang(array, lang){
        var reponse = [];
        var target = lang+']';
        var target2 = '[:';

        array.map( function (value) {
            let temp = new Object();
            let index_start;
            for (let key in value){
                if(key !== 'date' && key!=='image' && typeof value[key] !== "number" && typeof value[key] !== "object"){
                    index_start =  value[key].indexOf(target);
                    let index_end = value[key].indexOf(target2, index_start);
                    let new_str  = value[key].slice(index_start+3, index_end);

                    temp[key] = new_str;
                }else {
                    temp[key] = value[key];
                }
            }
            if(index_start  > 0 ){
                reponse.push(temp);
            }
        });

        return reponse;
    }
}
