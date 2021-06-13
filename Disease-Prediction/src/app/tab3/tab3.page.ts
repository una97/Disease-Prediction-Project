import { Component } from '@angular/core';

//added
import { NavController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import 'rxjs/Rx';
import { Papa } from 'ngx-papaparse';

enum File {
  REF = "REF",
  TEST = "TEST",
}
  /*
  1. test파일들을 해시테이블 형태로 만든다 key:SNP, val:geno
  2. reference파일이 15726개이기 때문에 for문으로 hash테이블에 값이 있는 지 확인
  3. 있으면 SNPs배열에 추가(다음 테스트 파일을 검사할 땐 얘로 바로 접근)하고, geno cnt 증가시키고, pvalMax0, pvalMin0 등을 갱신
  4. 끝나면 test2,test3도 진행
  */
@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page {
  public reference: any[] = []; //레퍼런스 파싱된 데이터를 저장한 배열 
  public resultArr: any[] = []; //테스트파일 파싱된 데이터를 저장한 배열
  public referenceSNPs: any[] = []; //파싱된 레퍼런스에서 SNP만 모아놓은 배열

  //genotype별로 SNP개수를 세기 위한 변수 
  public geno_cnt0 = 0;
  public geno_cnt1 = 0;
  public geno_cnt2 = 0;

  //genotype별로 p.val의 최대 최소를 구하기 위한 변수
  public pvalMax0 = Number.MIN_SAFE_INTEGER;
  public pvalMin0 = Number.MAX_SAFE_INTEGER;
  public pvalMax1 = Number.MIN_SAFE_INTEGER;
  public pvalMin1 = Number.MAX_SAFE_INTEGER;
  public pvalMax2 = Number.MIN_SAFE_INTEGER;
  public pvalMin2 = Number.MAX_SAFE_INTEGER;

  //테스트 파일의 SNP와 genotype를 키-값으로 저장하는 맵 
  public snpTestHash1 = new Map();

  /*
  constructor는 javascript엔진에서 호출
  생성자-> ngOnInit-> ionViewWillEnter 순으로 진행. 
  백 생성자 다 진행된 뒤에 ionViewWillEnter진행되므로 백 코드는 여기에 쓰기
  */
  constructor(public navCtrl: NavController, public http: HttpClient, private papa: Papa) {
    this.readCsvData('./assets/data/itrc_snp_hypertension_sm.csv', File.REF);
    this.execute();
    console.log("constructor")
  }

  //.ts 파일의 template으로 지정된 .html에 들어가기 전에 먼저 실행되는 메서드.page가 시작되기 전에 먼저 수행됨.
  ionViewWillEnter() {
  }

  ngOnInit() {
    console.log("ngOn")
  }

  //각 test.csv 파일에 대해 해시테이블 생성 
  private execute() {
    for (let i = 1; i <= 3; i++) {
      let path = "./assets/data/test_set" + i + ".csv"
      this.http.get(path, {
        responseType: 'text'
      }).subscribe(
        data => {
          this.extractData(data, File.TEST)
        },
        err => console.log('something went wrong: ', err)
      );
      // this.countGenoType();
    }
  }

  //geno 갯수와 pval 최대 최소 구하기 
  private getGenoCnt() {
    for (let data of this.referenceSNPs) {
      if (this.snpTestHash1.has(data[0])) { //일치하는 SNP가 있다면 저장해둔다. 이 때, test파일의 geno값에 따라 cnt값이 달라진다. 
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
      }

    }
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
        this.getGenoCnt();
      }
    });
  }
  // read csv data 
  private readCsvData(path, fileType) {
    this.http
      .get(path, {
        responseType: 'text' //http가 json을 기대하기 때문에 text로 바꿔줌
      })
      .subscribe(
        data => {
          this.extractData(data, fileType);
        },
        err => console.log('something went wrong: ', err)
      );
  }

  //읽은 csv데이터를 파싱
  private extractData(res, fileType) {
    let csvData = res || '';
    // let resultData
    this.papa.parse(csvData, {
      complete: parsedData => {
        // parsedData.data.splice(0, 1)[0]; // ["CHR", "SNP", "geno"]  //splice() 메서드는 배열의 기존 요소를 삭제 또는 교체하거나 새 요소를 추가하여 배열의 내용을 변경합니다.
        // resultData = parsedData.data
        let realParsedData = parsedData.data.slice(1)
        if (fileType == "REF") {
          // this.reference = parsedData.data.slice(1)
          this.reference = realParsedData
          // console.log(resultData)
          for (var data of this.reference) {
            this.referenceSNPs.push([data[0], data[4]]); //스닙과 p.val 저장. 
          }
          console.log(this.reference)
        }
        else if (fileType == "TEST") {
          this.snpTestHash1 = new Map(); //초기화
          this.resultArr = realParsedData
          this.resultArr.forEach(element => {
            this.snpTestHash1.set(element[1], element[2]) //해시테이블에 저장 -> snp와 genotype 
          });
          this.getGenoCnt();
        }
      }
    })
    // return resultData
  }

  // private countGenoType() {
  //   console.log(this.geno_cnt0, this.geno_cnt1, this.geno_cnt2)
  // }
  
  change(event) {
    console.log(event.detail.value)
  }

}
