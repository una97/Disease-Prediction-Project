import { Component } from '@angular/core';
//added
import { NavController } from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import { File } from '@ionic-native/file/ngx';
import * as papa from 'papaparse'; //to parse csv file 

export interface IHash {
  [indexer: string] : any;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})

export class Tab2Page {
  public csvData: any[] = [];
  public headerRow : any; //형 지정해주면 할당할 때 에러난다. 

  snpHash: IHash = {};   
  

  constructor(public navCtrl: NavController, public http : HttpClient) {
    this.readCsvData();
    this.snpHash["ss"] = "ss";
    console.log(this.snpHash);
    for (let i = 1; i <=3; i++) {
      let path = "./assets/data/test_set"+i+".csv"
      console.log(path);    
    }
  }
  // read csv data 
  private readCsvData() {
    this.http
      .get('./assets/data/test.csv', {
        responseType: 'text'
      })
      .subscribe(
        data => this.extractData(data),
        err => console.log('something went wrong: ', err)
      );
  }

  private extractData(res) {
    let csvData = res || '';
    let parsedData = papa.parse(csvData).data;
    let header = parsedData.splice(0,1)[0]
    this.headerRow = header
    this.csvData = parsedData //전역변수로 지정해 줘야 바뀐다. 
    console.log(csvData);
  }

}
