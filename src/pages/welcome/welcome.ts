import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { LoginPage } from "../login/login";
import { RegisterPage } from "../register/register";
import { Sim } from "@ionic-native/sim";

@Component({
  selector: 'page-welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  constructor(public navCtrl: NavController,  public sim: Sim) {
    this.sim.requestReadPermission().then(
      () => console.log('Permission granted '),
      () => console.log('Permission denied ')
    );
  }

  Login(){
    this.navCtrl.push(LoginPage);
  }

  SignUp(){
    this.navCtrl.push(RegisterPage);
  }

}
