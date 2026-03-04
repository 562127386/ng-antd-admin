import { Component, Input, Output, EventEmitter, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzDividerModule } from 'ng-zorro-antd/divider';
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
    NzDividerModule
  ],
  templateUrl: './sampling-scheme-config.component.html',
  styleUrls: ['./sampling-scheme-config.component.less']
})
export class SamplingSchemeConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private aqlConfigService = inject(AqlConfigService);
  private cdr = inject(ChangeDetectorRef);

  @Input() config?: string;
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
  currentSchemeType = 1;

  ngOnInit(): void {
    this.initForm();
    this.loadAqlConfigs();
    if (this.config) {
      this.parseConfig(this.config);
    }
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
}
