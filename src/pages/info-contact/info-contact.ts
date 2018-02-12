import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {IMarker, IPoint} from "../info-contact/interface";

@Component({
    selector: 'page-info-contact',
    templateUrl: 'info-contact.html',
})
export class InfoContactPage {
    maps: any;
    x: any;
    y: any;
    public gestureHandling: string = 'cooperative';
    public markers: IMarker[];
    public origin: IPoint;
    public zoom: number;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.x = Number(this.navParams.get('x'));
        this.y = Number(this.navParams.get('y'));
        //console.log(this.x, this.y);
        this.initMarkers(this.x, this.y);

        this.origin = {
            lat: this.x,
            lng: this.y
        };
        this.zoom = 17;
    }

    ionViewDidLoad() {

     //   this.initMarkers(x, y);
    }

    /*public clickedMarker(label: string) {
        window.alert(`clicked the marker: ${label || ''}`);
    }*/

    private initMarkers(x, y): void {
        this.markers = [{
            lat: x,
            lng: y,
            label: 'A'
        }];
    }
}
