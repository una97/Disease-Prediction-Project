import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import * as papa from 'papaparse'; //to parse csv file 
import 'rxjs/Rx';
import { Papa } from 'ngx-papaparse';
// import { Papa } from 'ngx-papaparse';
import { File } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  public csvItems : any; //형 지정x

  csvData: any[] = [];
  headerRow: any[] = [];
 

  constructor(public navCtrl: NavController, public http : HttpClient,
    // private papa: Papa,
    private file: File) {
    // this.readCsvData();
  }


  
  
 

  handleError(err: any) {
    throw new Error('Method not implemented.');
  }

  


}
