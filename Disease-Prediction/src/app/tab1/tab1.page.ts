import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import * as papa from 'papaparse'; //to parse csv file 
import 'rxjs/Rx';

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

  // ionViewWillEnter(){
  //   this.loadCSV();
  // }
  
  loadCSV(){
    this.http.get('./assets/data/test_set1.csv')
    // .map((res: Response) => res.json())
    .subscribe((data)=>
    {
       this.csvItems = data,
        err => this.handleError(err)
    });
    
  }

  
  private readCsvData() {
    this.http
      .get('./assets/data/test_set1.csv', {
        responseType: 'text'
      })
      .subscribe(
        data => this.extractData(data),
        err => console.log('something went wrong: ', err)
      );
  }
  private extractData(res) {
    let csvData = res || '';
    // console.log(this.headerRow);
    
    let parsedData = papa.parse(csvData).data;
    console.log(parsedData);
    // this.papa.parse(csvData, {
    //   complete: parsedData => {
    //     this.headerRow = parsedData.data.splice(0, 1)[0];
    //     this.csvData = parsedData.data;
    //   }
    // });
  }
  // private extractData(res) {
  //   let csvData = res['_body'] || '';
  //   let parsedData = papa.parse(csvData).data;
 
  //   // this.headerRow = parsedData[0];
 
  //   parsedData.splice(0, 1);
  //   this.csvData = parsedData;
  // }

  handleError(err: any) {
    throw new Error('Method not implemented.');
  }

  // parseCSVFile(data){
  //   let parsedData = papa.parse(data).data;
  //   console.log(parsedData)

  // }


}
