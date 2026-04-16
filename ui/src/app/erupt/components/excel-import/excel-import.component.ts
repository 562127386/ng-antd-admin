import {Component, Inject, Input, OnInit} from "@angular/core";
//import {DataService} from "@shared/service/data.service";
import {DrillInput, EruptModel} from "../../model/erupt.model";
import {DA_SERVICE_TOKEN, TokenService} from "@delon/auth";
import {EruptApiModel, Status} from "../../model/erupt-api.model";
import {NzModalService} from "ng-zorro-antd/modal";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzUploadChangeParam, NzUploadFile} from "ng-zorro-antd/upload";
import { DataService } from "@app/shared/zero-code/data.service";
import { FileUploadService } from "@app/erupt/service/file-upload.service";
import { NzProgressStatusType } from "ng-zorro-antd/progress";

@Component({
    standalone: false,
    selector: "app-excel-import",
    templateUrl: "./excel-import.component.html",
    styles: []
})
export class ExcelImportComponent implements OnInit {

    @Input() eruptModel: EruptModel;

    @Input() drillInput: DrillInput;

    upload: boolean = false;

    fileList: NzUploadFile[] = [];

    errorText: string;

    header: object;

    constructor(public dataService: DataService,private uploadService: FileUploadService,
                @Inject(NzModalService)
                private modal: NzModalService,
                @Inject(NzMessageService) private msg: NzMessageService,
                @Inject(DA_SERVICE_TOKEN) public tokenService: TokenService) {

    }

    ngOnInit() {
        // this.header = {
        //     token: this.tokenService.get().token,
        //     erupt: this.eruptModel.eruptName
        // }
        if (this.drillInput) {
            Object.assign(this.header, DataService.drillToHeader(this.drillInput))
        }
    }


    // upLoadNzChange(param: NzUploadChangeParam) {
    //     const file = param.file;
    //     this.errorText = '';
    //     if (file.status === "done") {
    //         if ((<EruptApiModel>file.response).status == Status.ERROR) {
    //             this.errorText = file.response.message;
    //             this.fileList = [];
    //         } else {
    //             this.upload = true;
    //             this.msg.success("导入成功");
    //         }
    //     } else if (file.status === "error") {
    //         this.errorText = file.error.error.message;
    //         this.fileList = [];
    //     }
    // }



     // 状态条文本
  statusText = '';
  // 状态类型：wait / process / done / error
statusType: NzProgressStatusType = 'normal';

    /**
   * 上传前拦截（返回false => 手动上传）
   */
  beforeUpload = (file: any): boolean => {
    // // 格式校验
    // const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf'];
    // if (!allowedTypes.includes(file.type!)) {
    //   this.msg.error('只支持 png/jpg/pdf');
    //   return false;
    // }
    // 大小限制 10MB
    if (file.size! > 10 * 1024 * 1024) {
      this.msg.error('文件不能超过10MB');
      return false;
    }

    // 1. 上传中
    this.statusText = '上传中...';
    this.statusType = 'active';

    // if (!file.originFileObj) return false;
    // this.uploadService.upload(file.originFileObj).subscribe({
    this.uploadService.import(file).subscribe({
      next: (res) => {
        this.msg.success('上传成功！');
        console.log('文件标识：', res);
        
         // 2. 上传成功
        // this.statusText = '上传成功';
        // this.statusType = 'success';
        // this.statusText = '正在导入...';
        // this.statusType = 'active';
        //  // 模拟导入请求
        //   this.importFile(res).subscribe({
        //     next: () => {
        //       this.statusText = '导入成功';
        //       this.statusType = 'done';
        //       this.msg.success('全部完成！');
        //       this.reset();
        //     },
        //     error: () => {
        //       this.statusText = '导入失败';
        //       this.statusType = 'error';
        //       this.msg.error('导入失败');
        //     }
        //   }); 

      },
      error: () => this.msg.error('上传失败'),
    });

    return false; // 关键：返回false => 不自动上传
  };


  // 重置
  reset(): void {
    //this.selectedFile = null;
    this.fileList = [];
    this.statusText = '';
    this.statusType = 'normal';
  }
/**
   * 文件列表变化
   */
  upLoadNzChange(info: NzUploadChangeParam): void {
    this.fileList = info.fileList;
  }

  /**
   * 手动提交上传
   */
  submitUpload(): void {
    if (this.fileList.length === 0) {
      this.msg.warning('请先选择文件');
      return;
    }

    const file = this.fileList[0].originFileObj!;

    this.uploadService.upload(file).subscribe({
      next: (fileName) => {
        this.msg.success('上传成功！');
        console.log('服务器返回文件名：', fileName);
        this.fileList = []; // 清空列表
       

      },
      error: (err) => {
        this.msg.error('上传失败：' + err.message);
      },
    });
  }



  
}
