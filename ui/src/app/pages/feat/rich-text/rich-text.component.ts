import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '@env/environment';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { WaterMarkComponent } from '@shared/components/water-mark/water-mark.component';
import { EditorComponent } from '@tinymce/tinymce-angular';

import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzGridModule } from 'ng-zorro-antd/grid';

@Component({
  selector: 'app-rich-text',
  templateUrl: './rich-text.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeaderComponent, NzCardModule, WaterMarkComponent, FormsModule, NzFormModule, ReactiveFormsModule, NzGridModule, EditorComponent]
})
export class RichTextComponent {
  private fb = inject(NonNullableFormBuilder);

  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '富文本，人们总是喜欢用花里胡哨的文字，表达自己空虚的情感',
    breadcrumb: ['首页', '扩展功能', '富文本']
  };
  uploadRichFileUrl = environment['apiUrl'] + '/rich-upload';
  validateForm = this.fb.group({
    detail: ['', [Validators.required]]
  });

  // 所有配置
  // http://tinymce.ax-z.cn/configure/editor-appearance.php
  editInit = {
    // automatic_uploads: false,
    language: 'zh_CN',
    language_url: '/tinymce/langs/zh_CN.js',
    skin: 'oxide',
    // skin_url: '/assets/tinymce/skins/ui/oxide',
    // content_css: '/assets/tinymce/skins/content/default/',
    base_url: '/tinymce',
    suffix: '.min',
    height: 600,
    toolbar_mode: 'none',
    plugins: [
      'advlist', 'anchor', 'autolink', 'autosave', 'axupimgs', 'charmap', 'code', 'codesample', 'directionality',
      'emoticons', 'fullscreen', 'help', 'hr', 'image', 'imagetools', 'importcss', 'indent2em', 'insertdatetime',
      'link', 'lists', 'media', 'nonbreaking', 'pagebreak', 'paste', 'preview', 'print', 'quickbars', 'save',
      'searchreplace', 'tabfocus', 'table', 'template', 'textpattern', 'toc', 'visualblocks', 'visualchars', 'wordcount',
      'table'
    ],
    // Toolbar
    toolbar: 'fullscreen preview code | undo redo | formatselect | bold italic underline strikethrough | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor removeformat | charmap | link media image | insertdatetime | hr table | ltr rtl | bullist numlist indent | subscript superscript | toc',
    // Quickbars
    quickbars_insert_toolbar: 'quicklink image table',
    quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
    // menubar: false,
    // statusbar: false,
    content_style: `
      body {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
          'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
          'Noto Color Emoji';
      }
    `
  };

  fnHandleChange(e: Event): void {
    // console.log(e);
  }
}
