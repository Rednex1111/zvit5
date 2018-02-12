import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from "../../providers/language.service";
import { LanguageModel } from "../../model/language.model";
import { AuthenticationServiceProvider } from "../../providers/authentication-service/authentication-service";

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
    languageSelected : any;
    languages : Array<LanguageModel>;

  constructor(public navCtrl: NavController,
              public AuthService: AuthenticationServiceProvider,
              public translate: TranslateService,
              public languageService: LanguageService) {
      this.languages = this.languageService.getLanguages();
      this.setLanguage();
  }

    setLanguage(){
        let defaultLanguage = this.translate.getDefaultLang();
        if(this.languageSelected){
            this.translate.setDefaultLang(this.languageSelected);
            this.translate.use(this.languageSelected);
            this.translate.get('SettingsPage',this.languageSelected).subscribe(
                res =>{
                    document.getElementById('title_page').innerText = res;
                });
            this.AuthService.setUserLang({
                language: this.languageSelected
            });
        }else{
            this.languageSelected = defaultLanguage;
            this.translate.use(defaultLanguage);

            this.translate.get('SettingsPage',this.languageSelected).subscribe(
                res =>{
                    document.getElementById('title_page').innerText = res;
                });

            this.AuthService.setUserLang({
                language: this.languageSelected
            });
        }
    }

}
