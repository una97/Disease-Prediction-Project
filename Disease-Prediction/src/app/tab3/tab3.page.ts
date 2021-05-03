import { Component } from '@angular/core';

//added
import { NavController } from '@ionic/angular';
import {HttpClient} from '@angular/common/http';
import 'rxjs/Rx';
import * as papa from 'papaparse'; //to parse csv file 
import {Papa} from 'ngx-papaparse';
import { type } from 'node:os';
import { count } from 'rxjs-compat/operator/count';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public reference: any[] = [];
  public referenceSNPs: any[] = [];
  public set1Data: any;
  public num0 = 0;
  public num1 = 0;
  public num2 = 0;


  constructor(public navCtrl: NavController, public http : HttpClient, private papa:Papa) {
    // this.readCsvData('./assets/data/itrc_snp_hypertension_sm.csv',0);
    //for test
    this.readCsvData('./assets/data/test_reference.csv',0);
    this.readCsvData('./assets/data/test.csv',1)
  }

  //.ts 파일의 template으로 지정된 .html에 들어가기 전에 먼저 실행되는 메서드.page가 시작되기 전에 먼저 수행됨.
  ionViewWillEnter(){
  }

  ngOnInit(){
    // this.readCsvData('./assets/data/itrc_snp_hypertension_sm.csv',0);
    // this.readCsvData('./assets/data/test_set1.csv',1)
  }

  // read csv data 
  private readCsvData(path,fileData) {
    let result:any;
      this.http
      .get(path, {
        responseType: 'text' //http가 json을 기대하기 때문에 text로 바꿔줌
      })
      .subscribe(
        data => {
          this.extractData(data,fileData);
        },
        err => console.log('something went wrong: ', err)
      );
      
  }


  private extractData(res,fileData) {
    let csvData = res || '';
    let resultData
    this.papa.parse(csvData,{
      complete : parsedData =>{
        parsedData.data.splice(0,1)[0];
        resultData = parsedData.data
        if (fileData ==0){
          this.reference = resultData
          for (var data of this.reference){
            this.referenceSNPs.push(data[0])
          }
          console.log(this.referenceSNPs)
        }
        else if(fileData==1){
          this.set1Data = resultData
        }

      }
      
    })
    return resultData

    
  }

  private countGenoType(){
   
    console.log(this.referenceSNPs)

    console.log(this.reference)

    for(var setdata of this.set1Data){
      if (this.referenceSNPs.includes(setdata[1]) ){
        if (setdata[2] == 0) this.num0++;
        else if (setdata[2] == 1) this.num1++;
        else if (setdata[2] == 2) this.num2++;
        console.log(setdata[1],setdata[2])
      }
    }



  }
  change(event){
    console.log(event.detail.value)
  }

}
