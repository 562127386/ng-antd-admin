import { Component, OnInit, Inject, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService, NzModalRef } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { Observable, of } from 'rxjs';

import { QualityIndicatorDto } from '@app/pages/base-data/models/quality-indicator.model';
import { QualityIndicatorService } from '@app/pages/base-data/services/quality-indicator.service';

@Component({
  selector: 'app-quality-indicator-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTableModule,
    NzButtonModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzModalModule,
    NzCheckboxModule,
    NzSpinModule
  ],
  templateUrl: './quality-indicator-selector.component.html',
  styleUrls: ['./quality-indicator-selector.component.less']
})
export class QualityIndicatorSelectorComponent implements OnInit {
  private qualityIndicatorService = inject(QualityIndicatorService);
  private fb = inject(FormBuilder);
  private messageService = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  modalRef!: NzModalRef;

  loading = false;
  qualityIndicators: QualityIndicatorDto[] = [];
  filteredIndicators: QualityIndicatorDto[] = [];
  selectedIndicators: Set<string> = new Set<string>();
  allChecked = false;
  indeterminate = false;

  searchForm!: FormGroup;

  constructor() {
    this.initForm();
  }

  ngOnInit(): void {
    this.loadQualityIndicators();
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      code: [''],
      name: [''],
      indicatorCategory: [''],
      inspectionType: ['']
    });
  }

  loadQualityIndicators(): void {
    this.loading = true;
    this.qualityIndicatorService.getAllItems().subscribe({
      next: (items: QualityIndicatorDto[]) => {
        this.qualityIndicators = items;
        this.filteredIndicators = [...items];
        this.loading = false;
        this.cdr.markForCheck();
      },
      error: () => {
        this.loading = false;
        this.messageService.error('加载质检指标失败');
        this.cdr.markForCheck();
      }
    });
  }

  onSearch(): void {
    const formValue = this.searchForm.value;
    this.filteredIndicators = this.qualityIndicators.filter(item => {
      const codeMatch = !formValue.code || item.code.toLowerCase().includes(formValue.code.toLowerCase());
      const nameMatch = !formValue.name || item.name.toLowerCase().includes(formValue.name.toLowerCase());
      const categoryMatch = !formValue.indicatorCategory || item.indicatorCategory.toLowerCase().includes(formValue.indicatorCategory.toLowerCase());
      const typeMatch = !formValue.inspectionType || item.inspectionType.toLowerCase().includes(formValue.inspectionType.toLowerCase());
      return codeMatch && nameMatch && categoryMatch && typeMatch;
    });
    this.updateAllChecked();
    this.cdr.markForCheck();
  }

  onReset(): void {
    this.searchForm.reset();
    this.filteredIndicators = [...this.qualityIndicators];
    this.updateAllChecked();
    this.cdr.markForCheck();
  }

  onAllCheckedChange(checked: boolean): void {
    this.selectedIndicators.clear();
    if (checked) {
      this.filteredIndicators.forEach(item => {
        this.selectedIndicators.add(item.id);
      });
    }
    this.updateAllChecked();
    this.cdr.markForCheck();
  }

  onItemCheckedChange(itemId: string, checked: boolean): void {
    if (checked) {
      this.selectedIndicators.add(itemId);
    } else {
      this.selectedIndicators.delete(itemId);
    }
    this.updateAllChecked();
    this.cdr.markForCheck();
  }

  updateAllChecked(): void {
    if (this.filteredIndicators.length === 0) {
      this.allChecked = false;
      this.indeterminate = false;
      return;
    }
    this.allChecked = this.filteredIndicators.every(item => this.selectedIndicators.has(item.id));
    this.indeterminate = this.selectedIndicators.size > 0 && !this.allChecked;
  }

  confirm(): void {
    const selectedItems = this.qualityIndicators.filter(item => 
      this.selectedIndicators.has(item.id)
    );
    this.modalRef.close(selectedItems);
  }

  cancel(): void {
    this.modalRef.close([]);
  }
}
