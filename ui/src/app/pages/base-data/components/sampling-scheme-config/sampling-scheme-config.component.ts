import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { Observable } from 'rxjs';
import { SamplingSchemeConfig, AqlSamplingConfig, CZeroSamplingConfig, VariableSamplingConfig, ContinuousSamplingConfig, SkipLotSamplingConfig } from '../../models/sampling-scheme-config.model';
import { AqlConfigDto } from '../../models/aql-config.model';
import { AqlConfigService } from '../../services/aql-config.service';

@Component({
  selector: 'app-sampling-scheme-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzSelectModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzCardModule,
    NzDividerModule,
    NzTableModule,
    NzTagModule,
    NzModalModule,
    NzIconModule,
    NzButtonModule,
    NzEmptyModule,
    NzDividerModule
  ],
  templateUrl: './sampling-scheme-config.component.html',
  styleUrls: ['./sampling-scheme-config.component.less']
})
export class SamplingSchemeConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private aqlConfigService = inject(AqlConfigService);
  private messageService = inject(NzMessageService);
  private modal = inject(NzModalService);
  private cdr = inject(ChangeDetectorRef);

  @Input() config?: string;
  @Input() schemeId?: string;
  @Output() configChange = new EventEmitter<string>();

  configForm!: FormGroup;
  schemeTypeOptions = [
    { label: 'AQL抽样', value: 1 },
    { label: 'C=0抽样', value: 2 },
    { label: '计量抽样', value: 3 },
    { label: '连续抽样', value: 4 },
    { label: '跳批抽样', value: 5 }
  ];

  inspectionLevelOptions = [
    { label: 'S-1', value: 1 },
    { label: 'S-2', value: 2 },
    { label: 'S-3', value: 3 },
    { label: 'S-4', value: 4 },
    { label: 'I', value: 5 },
    { label: 'II', value: 6 },
    { label: 'III', value: 7 }
  ];

  aqlConfigOptions: AqlConfigDto[] = [];
  aqlDetails: AqlConfigDto[] = [];
  currentSchemeType = 1;
  isEditingAql = false;
  editingAqlDetail: Partial<AqlConfigDto> = {};
  isLoadingAqlDetails = false;
  parsedConfig?: SamplingSchemeConfig;

  ngOnInit(): void {
    this.initForm();
    this.loadAqlConfigs();
    if (this.config) {
      this.parseConfig(this.config);
    }
    if (this.schemeId) {
      this.loadAqlDetailsForScheme(this.schemeId);
    }
  }

  loadAqlDetailsForScheme(schemeId: string): void {
    this.isLoadingAqlDetails = true;
    this.aqlConfigService.getList({ 
      samplingSchemeId: schemeId, 
      maxResultCount: 1000 
    }).subscribe({
      next: (result) => {
        this.aqlDetails = result.items;
        this.isLoadingAqlDetails = false;
      },
      error: () => {
        this.isLoadingAqlDetails = false;
      }
    });
  }

  initForm(): void {
    this.configForm = this.fb.group({
      schemeType: [1, [Validators.required]],
      aqlConfig: this.fb.group({
        aqlConfigId: [null],
        inspectionLevel: [null],
        aqlValue: [null]
      }),
      cZeroConfig: this.fb.group({
        fixedSampleSize: [null],
        acceptanceNumber: [null],
        rejectionNumber: [null]
      }),
      variableConfig: this.fb.group({
        sampleSize: [null],
        kValue: [null],
        sigmaKnown: [false]
      }),
      continuousConfig: this.fb.group({
        iQualityLevel: [null],
        samplePercentage: [null],
        fFrequency: [null]
      }),
      skipLotConfig: this.fb.group({
        skipLotNumber: [null],
        iQualityLevel: [null],
        lotSize: [null]
      })
    });

    this.configForm.get('schemeType')?.valueChanges.subscribe((type) => {
      this.currentSchemeType = type;
      this.generateConfig();
    });

    this.configForm.valueChanges.subscribe(() => {
      this.generateConfig();
    });
  }

  loadAqlConfigs(): void {
    this.aqlConfigService.getList({ isEnabled: true, maxResultCount: 1000 }).subscribe({
      next: (result) => {
        this.aqlConfigOptions = result.items;
        this.cdr.markForCheck();
      }
    });
  }

  parseConfig(configJson: string): void {
    try {
      const config: SamplingSchemeConfig = JSON.parse(configJson);
      this.parsedConfig = config;
      this.currentSchemeType = config.schemeType;
      this.configForm.patchValue({
        schemeType: config.schemeType,
        aqlConfig: config.aqlConfig || {},
        cZeroConfig: config.cZeroConfig || {},
        variableConfig: config.variableConfig || {},
        continuousConfig: config.continuousConfig || {},
        skipLotConfig: config.skipLotConfig || {}
      });
    } catch (e) {
      console.error('解析抽样方案配置失败:', e);
    }
  }

  generateConfig(): void {
    const formValue = this.configForm.value;
    const config: SamplingSchemeConfig = {
      schemeType: formValue.schemeType
    };

    switch (formValue.schemeType) {
      case 1:
        config.aqlConfig = formValue.aqlConfig;
        break;
      case 2:
        config.cZeroConfig = formValue.cZeroConfig;
        break;
      case 3:
        config.variableConfig = formValue.variableConfig;
        break;
      case 4:
        config.continuousConfig = formValue.continuousConfig;
        break;
      case 5:
        config.skipLotConfig = formValue.skipLotConfig;
        break;
    }

    this.configChange.emit(JSON.stringify(config, null, 2));
  }

  getInspectionLevelText(level: number): string {
    const option = this.inspectionLevelOptions.find(o => o.value === level);
    return option ? option.label : '';
  }

  get selectedAqlConfig(): AqlConfigDto | undefined {
    const aqlConfigId = this.configForm.get('aqlConfig.aqlConfigId')?.value;
    if (!aqlConfigId) return undefined;
    return this.aqlConfigOptions.find(c => c.id === aqlConfigId);
  }

  get matchedAqlConfigs(): AqlConfigDto[] {
    const level = this.configForm.get('aqlConfig.inspectionLevel')?.value;
    const aqlValue = this.configForm.get('aqlConfig.aqlValue')?.value;
    
    let filtered = this.aqlConfigOptions;
    
    if (level) {
      filtered = filtered.filter(c => c.inspectionLevel === level);
    }
    if (aqlValue) {
      filtered = filtered.filter(c => c.aqlValue === aqlValue);
    }
    
    return filtered.slice(0, 10);
  }

  addAqlDetail(): void {
    this.editingAqlDetail = {
      samplingSchemeId: this.schemeId,
      inspectionLevel: undefined,
      aqlValue: undefined,
      minLotSize: undefined,
      maxLotSize: undefined,
      sampleSizeCode: '',
      sampleSize: undefined,
      acceptanceNumber: undefined,
      rejectionNumber: undefined,
      isEnabled: true
    };
    this.isEditingAql = true;
  }

  editAqlDetail(aql: AqlConfigDto): void {
    this.editingAqlDetail = { ...aql };
    this.isEditingAql = true;
  }

  saveAqlDetail(): void {
    const validationError = this.validateAqlDetail();
    if (validationError) {
      this.messageService.error(validationError);
      return;
    }

    if (!this.editingAqlDetail?.id) {
      this.aqlConfigService.create(this.editingAqlDetail as any).subscribe({
        next: (result) => {
          this.aqlDetails = [...this.aqlDetails, result];
          this.isEditingAql = false;
          this.editingAqlDetail = {};
        },
        error: () => {
          this.messageService.error('保存AQL明细失败');
        }
      });
    } else {
      this.aqlConfigService.update(this.editingAqlDetail.id, this.editingAqlDetail as any).subscribe({
        next: (result) => {
          const index = this.aqlDetails.findIndex(a => a.id === result.id);
          if (index >= 0) {
            this.aqlDetails[index] = result;
            this.aqlDetails = [...this.aqlDetails];
          }
          this.isEditingAql = false;
          this.editingAqlDetail = {};
        },
        error: () => {
          this.messageService.error('保存AQL明细失败');
        }
      });
    }
  }

  cancelEditAql(): void {
    this.isEditingAql = false;
    this.editingAqlDetail = {};
  }

  validateAqlDetail(): string | null {
    const { sampleSize, minLotSize, maxLotSize, acceptanceNumber, rejectionNumber } = this.editingAqlDetail;
    
    if (!sampleSize || !maxLotSize || acceptanceNumber === undefined || rejectionNumber === undefined) {
      return '请填写完整的样本量和批量信息';
    }

    if (sampleSize > maxLotSize) {
      return '样本量不能大于批量最大值';
    }

    if (acceptanceNumber >= sampleSize) {
      return '接收数(Ac)必须小于样本量';
    }

    if (rejectionNumber !== acceptanceNumber! + 1) {
      return '拒收数(Re)必须等于接收数(Ac)+1';
    }

    if (rejectionNumber > sampleSize!) {
      return '拒收数(Re)不能大于样本量';
    }

    return null;
  }

  deleteAqlDetail(aql: AqlConfigDto): void {
    this.modal.confirm({
      nzTitle: '确认删除',
      nzContent: `确定要删除AQL配置 "${aql.code}" 吗？`,
      nzOkDanger: true,
      nzOnOk: () => {
        return new Promise<void>((resolve) => {
          this.aqlConfigService.delete(aql.id).subscribe({
            next: () => {
              this.aqlDetails = this.aqlDetails.filter(a => a.id !== aql.id);
              this.messageService.success('删除成功');
              this.cdr.markForCheck();
              resolve();
            },
            error: () => {
              this.messageService.error('删除失败');
              resolve();
            }
          });
        });
      }
    });
  }
}
