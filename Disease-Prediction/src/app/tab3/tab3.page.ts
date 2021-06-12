import { Component } from '@angular/core';

//added
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import * as papa from 'papaparse'; //to parse csv file 
import { Papa } from 'ngx-papaparse';
import { type } from 'node:os';
import { count } from 'rxjs-compat/operator/count';
// import { ConsoleReporter } from 'jasmine';


//snp 검색하기 위한 hashtable 
export interface IHash {
  [indexer: string]: any;
}
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public reference: any[] = [];
  public referenceSNPs: any[] = [];

  public duplicateSNPs: any[] = []; //Reference와 test에 존재하는 스닙들.


  public set1Data: any;
  public geno_cnt0 = 0;
  public geno_cnt1 = 0;
  public geno_cnt2 = 0;

  public pvalMax0 = Number.MIN_SAFE_INTEGER;
  public pvalMin0 = Number.MAX_SAFE_INTEGER;
  public pvalMax1 = Number.MIN_SAFE_INTEGER;
  public pvalMin1 = Number.MAX_SAFE_INTEGER;
  public pvalMax2 = Number.MIN_SAFE_INTEGER;
  public pvalMin2 = Number.MAX_SAFE_INTEGER;

  public resultArr: any[] = []; //파싱된 data어레이  


  public snpHash: IHash = {};
  public snpTestHash1 = new Map();
  public snpTestHash2 = new Map();
  public snpTestHash3 = new Map();

  /*
  1. test파일들을 해시테이블 형태로 만든다 key:SNP, val:geno
  2. reference파일이 15726개이기 때문에 for문으로 hash테이블에 값이 있는 지 확인
  3. 있으면 SNPs배열에 추가(다음 테스트 파일을 검사할 땐 얘로 바로 접근)하고, geno cnt 증가시키고, pvalMax0, pvalMin0 등을 갱신
  4. 끝나면 test2,test3도 진행
  */
  testPath = "./assets/data/test_set1.csv"
  //constructor는 javascript엔진에서 호출
  //생성자-> ngOnInit-> ionViewWillEnter 순으로 진행. 
  //백 생성자 다 진행된 뒤에 ionViewWillEnter진행되므로 백 코드는 여기에 쓰기
  constructor(public navCtrl: NavController, public http: HttpClient, private papa: Papa) {
    this.readCsvData('./assets/data/itrc_snp_hypertension_sm.csv', 0);
    //for test
    this.createHashTable();
    console.log("constructor")
    // this.readCsvData('./assets/data/test_reference.csv',0);
    // this.readCsvData('./assets/data/test.csv',1)
  }

  //.ts 파일의 template으로 지정된 .html에 들어가기 전에 먼저 실행되는 메서드.page가 시작되기 전에 먼저 수행됨.
  ionViewWillEnter() {
    // console.log(this.resultArr.length)
    // this.createHashTable().;
    // this.resultArr.forEach(element => {
    //   // console.log(element[1])
    //   this.snpHash[element[1]] = element[2] //해시테이블에 저장 
    //   let key = element[1]
    //   type key = string;
    //   this.snpTestHash1.set(key,element[2])
    // });
    // this.saveExistSNP();

  }

  ngOnInit() {
    // this.readCsvData('./assets/data/itrc_snp_hypertension_sm.csv',0);
    // this.readCsvData('./assets/data/test_set1.csv',1)
    console.log("ngOn")
  }

  private createHashTable() {
    for (let i = 1; i <= 3; i++) {
      let path = "./assets/data/test_set" + i + ".csv"
      this.http.get(path, {
        responseType: 'text'
      }).subscribe(
        data => {
          this.extractData_test(data)
        },
        err => console.log('something went wrong: ', err)
      );
      this.countGenoType();
    }

  }
  private saveExistSNP() {

    for (let data of this.referenceSNPs) {
      if (this.snpTestHash1.has(data[0])) { //일치하는 SNP가 있다면 저장해둔다. 이 때, test파일의 geno값에 따라 cnt값이 달라진다. 
        // console.log(this.snpTestHash1.get(data[0]))
        switch (this.snpTestHash1.get(data[0])) {
          case '0':
            this.geno_cnt0 += 1;
            this.pvalMax0 = Math.max(this.pvalMax0, data[1]);
            this.pvalMin0 = Math.min(this.pvalMin0, data[1]);
            break;
          case '1':
            this.geno_cnt1 += 1;
            this.pvalMax1 = Math.max(this.pvalMax1, data[1]);
            this.pvalMin1 = Math.min(this.pvalMin1, data[1]);
            break;
          case '2':
            this.geno_cnt2 += 1;
            this.pvalMax2 = Math.max(this.pvalMax2, data[1]);
            this.pvalMin2 = Math.min(this.pvalMin2, data[1]);
            break;
        }



        // this.duplicateSNPs.push(data[0])
      }

    }
    // console.log(this.duplicateSNPs);
  }
  //csv to array로 만드는 과정 
  private extractData_test(res) {
    let csvData = res || ''; // 초기화
    // let resultArr
    this.snpTestHash1 = new Map(); //초기화
    this.papa.parse(csvData, {
      complete: parsedData => {

        this.resultArr = parsedData.data.slice(1) //["1", "rs117589110", "0"] 배열들로 파싱됨

        this.resultArr.forEach(element => {
          this.snpTestHash1.set(element[1], element[2]) //해시테이블에 저장 -> snp와 genotype 
        });
        this.saveExistSNP();
        // console.log(this.snpTestHash1);
      }
    });
  }
  // read csv data 
  private readCsvData(path, fileData) {
    let result: any;
    this.http
      .get(path, {
        responseType: 'text' //http가 json을 기대하기 때문에 text로 바꿔줌
      })
      .subscribe(
        data => {
          this.extractData(data, fileData);
        },
        err => console.log('something went wrong: ', err)
      );

  }

  private extractData(res, fileData) {
    let csvData = res || '';
    let resultData
    this.papa.parse(csvData, {
      complete: parsedData => {
        parsedData.data.splice(0, 1)[0]; // ["CHR", "SNP", "geno"]  //splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경합니다.
        resultData = parsedData.data
        if (fileData == 0) {
          this.reference = resultData
          // console.log(resultData)
          for (var data of this.reference) {

            this.referenceSNPs.push([data[0], data[4]]); //스닙과 p.val 저장. 
          }
          // console.log(this.referenceSNPs)
          //console.log(this.referenceSNPs)
        }
        else if (fileData == 1) {
          this.set1Data = resultData //파싱한 데이터를 배열로 저장했음. ["1", "rs117589110", "0"]
          console.log(this.set1Data)
        }

      }

    })
    return resultData


  }

  private countGenoType() {

    // console.log(this.referenceSNPs)

    console.log(this.geno_cnt0, this.geno_cnt1, this.geno_cnt2)

    // for (var setdata of this.set1Data) {
    //   if (this.referenceSNPs.includes(setdata[1])) {
    //     if (setdata[2] == 0) this.num0++;
    //     else if (setdata[2] == 1) this.num1++;
    //     else if (setdata[2] == 2) this.num2++;
    //     console.log(setdata[1], setdata[2])
    //   }
    // }

  }
  change(event) {
    console.log(event.detail.value)
  }

}
