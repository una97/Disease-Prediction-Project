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

  constructor(public navCtrl: NavController, public http : HttpClient, private papa: Papa) {
    // this.readCsvData('./assets/data/itrc_snp_hypertension_sm.csv', 0);
    // this.createHashTable();
  }


  
  
 

  handleError(err: any) {
    throw new Error('Method not implemented.');
  }

  


}
