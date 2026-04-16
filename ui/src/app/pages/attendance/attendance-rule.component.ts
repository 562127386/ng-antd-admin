import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzTimePickerModule } from 'ng-zorro-antd/time-picker';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { AttendanceRuleService } from './services/attendance-rule.service';
import { AttendanceRule } from './models/attendance-rule.model';

@Component({
  selector: 'app-attendance-rule',
  templateUrl: './attendance-rule.component.html',
  styleUrls: ['./attendance-rule.component.less'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzButtonModule,
    NzCardModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzTimePickerModule,
    NzSwitchModule
  ],
  standalone: true
})
export class AttendanceRuleComponent implements OnInit {
  attendanceRules: AttendanceRule[] = [];
  isModalVisible = false;
  modalTitle = '新增考勤规则';
  form: FormGroup;
  editingRuleId: string | null = null;

  constructor(
    private fb: FormBuilder,
    private attendanceRuleService: AttendanceRuleService,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      ruleName: ['', Validators.required],
      description: [''],
      shiftStartTime: ['', Validators.required],
      shiftEndTime: ['', Validators.required],
      lateThreshold: [0, Validators.required],
      earlyLeaveThreshold: [0, Validators.required],
      absentThreshold: [0, Validators.required],
      isEnabled: [true]
    });
  }

  ngOnInit(): void {
    this.getAttendanceRules();
  }

  getAttendanceRules(): void {
    this.attendanceRuleService.getAttendanceRules().subscribe(
      (data) => {
        this.attendanceRules = data;
      },
      (error) => {
        this.message.error('获取考勤规则失败');
      }
    );
  }

  openCreateModal(): void {
    this.editingRuleId = null;
    this.modalTitle = '新增考勤规则';
    this.form.reset({
      ruleName: '',
      description: '',
      shiftStartTime: null,
      shiftEndTime: null,
      lateThreshold: 0,
      earlyLeaveThreshold: 0,
      absentThreshold: 0,
      isEnabled: true
    });
    this.isModalVisible = true;
  }

  openEditModal(rule: AttendanceRule): void {
    this.editingRuleId = rule.id;
    this.modalTitle = '编辑考勤规则';
    this.form.setValue({
      ruleName: rule.ruleName,
      description: rule.description,
      shiftStartTime: rule.shiftStartTime,
      shiftEndTime: rule.shiftEndTime,
      lateThreshold: rule.lateThreshold,
      earlyLeaveThreshold: rule.earlyLeaveThreshold,
      absentThreshold: rule.absentThreshold,
      isEnabled: rule.isEnabled
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleOk(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      if (this.editingRuleId) {
        this.attendanceRuleService.updateAttendanceRule(this.editingRuleId, formValue).subscribe(
          () => {
            this.message.success('编辑成功');
            this.isModalVisible = false;
            this.getAttendanceRules();
          },
          (error) => {
            this.message.error('编辑失败');
          }
        );
      } else {
        this.attendanceRuleService.createAttendanceRule(formValue).subscribe(
          () => {
            this.message.success('新增成功');
            this.isModalVisible = false;
            this.getAttendanceRules();
          },
          (error) => {
            this.message.error('新增失败');
          }
        );
      }
    } else {
      Object.values(this.form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  deleteRule(id: string): void {
    this.attendanceRuleService.deleteAttendanceRule(id).subscribe(
      () => {
        this.message.success('删除成功');
        this.getAttendanceRules();
      },
      (error) => {
        this.message.error('删除失败');
      }
    );
  }
}
