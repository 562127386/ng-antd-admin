import { Component, computed, Input, OnInit, signal } from '@angular/core';
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
import { ComplaintService } from '../../services/complaint.service';
import { ComplaintComment } from '../../models/complaint.model';

  const colorList = ['#f56a00', '#7265e6', '#ffbf00', '#00a2ae'];
@Component({
  selector: 'app-complaint-comments',
  templateUrl: './complaint-comments.component.html',
  imports: [
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

  // 模拟用户列表，实际应该从API获取
  users = [
    { id: '1', name: '张三' },
    { id: '2', name: '李四' },
    { id: '3', name: '王五' },
    { id: '4', name: '赵六' }
  ];

  index = signal(3); 
  color = computed(() => colorList[this.index()]);

  constructor(
    private complaintService: ComplaintService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.loadComments();
  }

  loadComments(): void {
    this.loading = true;
    this.complaintService.getComments(this.complaintId).subscribe({
      next: (result:any) => {
        this.comments = result.items;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  // 解析评论内容中的@提及用户
  private parseMentionedUsers(content: string): string {
    const mentionedUserNames = content.match(/@([^\s]+)/g) || [];
    const mentionedUserIds: string[] = [];

    mentionedUserNames.forEach(mention => {
      const userName = mention.substring(1); // 移除@符号
      const user = this.users.find(u => u.name === userName);
      if (user) {
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
      mentionedUsers: mentionedUsers
    }).subscribe({
      next: () => {
        this.message.success('评论成功');
        this.commentForm.reset();
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
