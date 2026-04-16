import {
  Component,
  ViewContainerRef,
  ChangeDetectionStrategy,
  forwardRef,
  Type,
  effect,
  DestroyRef,
  inject,
  input,
  viewChild,
  ChangeDetectorRef,
  OnDestroy
} from '@angular/core';
import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  ReactiveFormsModule
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// 类型定义：兼容 CVA 接口
type ControlValueAccessorLike = Partial<ControlValueAccessor> & {
  setDisabledState?(isDisabled: boolean): void;
};

// 类型定义：支持 formControl 输入的组件
type AcceptsFormControl = {
  formControl?: FormControl;
};

/**
 * 动态表单字段宿主组件
 * 用于动态渲染任意表单组件，自动实现表单双向绑定、禁用状态同步
 * 兼容 ControlValueAccessor / 带 formControl 属性的组件
 *
 * @example
 * <abp-dynamic-form-field-host
 *   [component]="InputComponent"
 *   [inputs]="{ placeholder: '请输入' }"
 *   [(ngModel)]="value"
 * ></abp-dynamic-form-field-host>
 */
@Component({
  selector: 'abp-dynamic-form-field-host',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `<ng-template #dynamicHost></ng-template>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DynamicFormFieldHostComponent),
      multi: true
    }
  ],
  host: { class: 'abp-dynamic-form-field-host' }
})
export class DynamicFormFieldHostComponent implements ControlValueAccessor, OnDestroy {
  // 要动态渲染的组件
  readonly component = input<Type<ControlValueAccessor>>();

  // 传递给子组件的输入参数
  readonly inputs = input<Record<string, unknown>>({});

  // 视图容器引用
  private readonly dynamicHost = viewChild.required('dynamicHost', { read: ViewContainerRef });
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly destroyRef = inject(DestroyRef);

  // 子组件实例引用
  private componentRef: any;

  // 表单状态
  private innerValue: unknown;
  private isDisabled = false;

  // 内部表单控制器（适配非 CVA 组件）
  private readonly innerControl = new FormControl<unknown>(null);

  // 表单回调
  private onChange: (value: unknown) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {
    // 监听组件/参数变化，自动重建/更新子组件
    effect(() => {
      const component = this.component();
      const inputs = this.inputs();

      if (component) {
        this.createDynamicComponent();
      } else if (this.componentRef && inputs) {
        this.applyComponentInputs();
      }
    });
  }

  ngOnDestroy(): void {
    // 销毁组件，防止内存泄漏
    if (this.componentRef) {
      this.componentRef.destroy();
    }
  }

  /**
   * 创建动态子组件
   */
  private createDynamicComponent(): void {
    this.dynamicHost().clear();
    const componentType = this.component();

    if (!componentType) return;

    // 创建组件实例
    this.componentRef = this.dynamicHost().createComponent(componentType);
    this.applyComponentInputs();

    const instance = this.componentRef.instance as ControlValueAccessorLike & AcceptsFormControl;

    // 适配：子组件实现 CVA
    if (this.isControlValueAccessor(instance)) {
      this.bindCvaInstance(instance);
    }
    // 适配：子组件支持 formControl 输入
    else if ('formControl' in instance) {
      this.bindFormControlInstance(instance);
    }

    this.cdr.markForCheck();
  }

  /**
   * 绑定实现 CVA 的子组件
   */
  private bindCvaInstance(instance: ControlValueAccessorLike): void {
    // 同步变更/触摸事件
    instance.registerOnChange?.((value: unknown) => this.onChange(value));
    instance.registerOnTouched?.(() => this.onTouched());

    // 同步初始禁用状态
    if (this.isDisabled && instance.setDisabledState) {
      instance.setDisabledState(true);
    }

    // 同步初始值
    if (this.innerValue !== undefined) {
      instance.writeValue?.(this.innerValue);
    }
  }

  /**
   * 绑定支持 formControl 的子组件
   */
  private bindFormControlInstance(instance: AcceptsFormControl): void {
    instance.formControl = this.innerControl;

    // 同步初始值
    if (this.innerValue !== undefined) {
      this.innerControl.setValue(this.innerValue, { emitEvent: false });
    }

    // 监听内部值变化
    this.innerControl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(value => this.onChange(value));

    // 同步禁用状态
    if (this.isDisabled && !this.innerControl.disabled) {
      this.innerControl.disable({ emitEvent: false });
    }
  }

  /**
   * 应用输入参数到子组件
   */
  private applyComponentInputs(): void {
    if (!this.componentRef) return;

    const instance = this.componentRef.instance;
    const inputProps = this.inputs() ?? {};

    Object.entries(inputProps).forEach(([key, value]) => {
      instance[key] = value;
    });

    this.componentRef.changeDetectorRef.markForCheck();
  }

  /**
   * 判断是否实现 CVA 接口
   */
  private isControlValueAccessor(obj: any): obj is ControlValueAccessorLike {
    return (
      obj &&
      typeof obj.writeValue === 'function' &&
      typeof obj.registerOnChange === 'function'
    );
  }

  // ------------------------------
  // ControlValueAccessor 实现
  // ------------------------------

  writeValue(value: unknown): void {
    this.innerValue = value;

    if (!this.componentRef) return;
    const instance = this.componentRef.instance;

    if (this.isControlValueAccessor(instance)) {
      instance.writeValue?.(value);
    } else if (instance.formControl instanceof FormControl) {
      instance.formControl.setValue(value, { emitEvent: false });
    }
  }

  registerOnChange(fn: (value: unknown) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;

    if (!this.componentRef) return;
    const instance = this.componentRef.instance;

    if (this.isControlValueAccessor(instance) && instance.setDisabledState) {
      instance.setDisabledState(isDisabled);
    } else if (instance.formControl instanceof FormControl) {
      isDisabled
        ? instance.formControl.disable({ emitEvent: false })
        : instance.formControl.enable({ emitEvent: false });
    }
  }
}