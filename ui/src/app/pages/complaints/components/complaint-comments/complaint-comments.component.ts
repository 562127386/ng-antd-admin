import { Component, computed, Inject, Input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCommentModule } from 'ng-zorro-antd/comment';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzAutocompleteModule } from 'ng-zorro-antd/auto-complete';
//import { ComplaintService } from '../../services/complaint.service';
import { ComplaintComment } from '../../models/complaint.model';
import { IdentityUserService } from '@app/proxy/volo/abp/identity/identity-user.service';
import { GetIdentityUsersInput, IdentityUserDto } from '@app/proxy/volo/abp/identity/models';

import { NzMentionModule } from 'ng-zorro-antd/mention';
import { ComplaintService } from '@app/proxy/application/complaints';
import { NzUploadChangeParam, NzUploadFile } from 'ng-zorro-antd/upload';
import { NzModalService } from 'ng-zorro-antd/modal';
import { FileUploadService } from '@app/erupt/service/file-upload.service';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { CreateUploadFileDto, UploadFileService } from '@app/proxy/upload-files';
import { NzSpinModule } from 'ng-zorro-antd/spin';

  const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
@Component({
  selector: 'app-complaint-comments',
  templateUrl: './complaint-comments.component.html',
  imports: [
    NzSpinModule,
    NzUploadModule,
    NzMentionModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzAvatarModule,
    NzCommentModule,
    NzFormModule,
    NzInputModule,
    NzListModule,
    NzAutocompleteModule
  ],
  standalone: true
})
export class ComplaintCommentsComponent implements OnInit {
  @Input() complaintId!: string;

  comments: ComplaintComment[] = [];
  loading = false;
  commentForm: FormGroup;

  // 从API获取的用户列表
  users: IdentityUserDto[] = [];

  index = signal(3); 
  color = computed(() => colorList[this.index()]);

  constructor(private uploadService: FileUploadService,private uploadFileService: UploadFileService,
                @Inject(NzModalService)
                private modal: NzModalService,
                @Inject(NzMessageService) private msg: NzMessageService,
    private complaintService: ComplaintService,
    private message: NzMessageService,
    private fb: FormBuilder,
    private identityUserService: IdentityUserService
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadComments();
    this.loadUsers();
  }
  
    open(path: any): void {
        this.uploadService.download(path).subscribe({
              next: (blob) => {
                // ✅ 核心：直接把后端返回的二进制流下载成文件
                const downloadUrl = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = downloadUrl;

                // 重要：这里可以写死文件名 + 后缀，或从后端传过来
                link.download = path; 
                // 例：link.download = '报表.pdf';
                // 例：link.download = '图片.png';

                document.body.appendChild(link);
                link.click();

                // 释放资源
                window.URL.revokeObjectURL(downloadUrl);
                document.body.removeChild(link);
              },
              error: (err) => {
                console.error('下载失败', err);
              }
            });
    }
   fileList: NzUploadFile[] = [];
    paths: string[] = [];
      // 核心状态：是否正在上传
  isUploading = false;
 /**
   * 文件列表变化
   */
  upLoadNzChange(info: NzUploadChangeParam): void {
    this.fileList = info.fileList;
  }
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
    if (file.size! > 50 * 1024 * 1024) {
      this.msg.error('上传文件不能超过50MB');
      return false;
    } 
    // if (!file.originFileObj) return false;
    this.isUploading =true;
    // this.uploadService.upload(file.originFileObj).subscribe({
    this.uploadService.upload(file).subscribe({
      next: (res) => {

        console.log('文件标识：', res);
        this.uploadFileService.create({entityName:'ComplaintComment',
                  recordId: this.complaintId,
                  name: res,
                  type: 'ext',
                  path: res}).subscribe(res2=>{
                      this.msg.success('上传成功！');
                      this.paths.push(res);
                      this.isUploading =false;
                  });
        
      },
      error: () =>{ this.msg.error('上传失败') ;this.isUploading = false;},
      complete: () => {
          // 上传结束（成功/失败都重置）
          this.isUploading = false;
      }
    });
    return false; // 关键：返回false => 不自动上传
  };




  loadComments(): void {
    this.loading = true;
    this.complaintService.getComments(this.complaintId,{ maxResultCount:500,skipCount:0 }).subscribe({
      next: (result:any) => {
        this.comments = result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  loadUsers(): void {
    const input: GetIdentityUsersInput = {
      skipCount: 0,
      maxResultCount: 1000 // 加载足够多的用户
    };
    
    this.identityUserService.getList(input).subscribe({
      next: (result) => {
        this.users = result.items || [];
      },
      error: (error) => {
        console.error('Failed to load users:', error);
        this.users = [];
      }
    });
  }

  valueWith = (data: IdentityUserDto): string => data.surname??data.name??data.userName??'';


  onSelect(suggestion: any): void {
    console.log(`onSelect ${suggestion}`);
  }


  // 解析评论内容中的@提及用户
  private parseMentionedUsers(content: string): string {
    const mentionedUserNames = content.match(/@([^\s]+)/g) || [];
    const mentionedUserIds: string[] = [];

    mentionedUserNames.forEach(mention => {
      const userName = mention.substring(1); // 移除@符号
      // 先匹配用户名，再匹配姓名
      const user = this.users.find(u => 
        u.userName === userName || 
        `${u.name} ${u.surname}`.trim() === userName ||
        u.name === userName ||
        u.surname === userName
      );
      if (user && user.id) {
        mentionedUserIds.push(user.id);
      }
    });

    return JSON.stringify(mentionedUserIds);
  }

  submitComment(): void {
    if (this.commentForm.invalid) return;

    const content = this.commentForm.value.content;
    const mentionedUsers = this.parseMentionedUsers(content);

    this.complaintService.createComment(this.complaintId, {
      content,
      mentionedUsers: mentionedUsers,
      files:this.paths
    }).subscribe({
      next: () => {
        this.message.success('评论成功');
        this.commentForm.reset();
        this.paths=[];
        this.loadComments();
      },
      error: () => {
        this.message.error('评论失败');
      }
    });
  }

  deleteComment(commentId: string): void {
    this.complaintService.deleteComment(this.complaintId, commentId).subscribe({
      next: () => {
        this.message.success('删除成功');
        this.loadComments();
      },
      error: () => {
        this.message.error('删除失败');
      }
    });
  }
}
