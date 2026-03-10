import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit, ViewEncapsulation, input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { concatMap } from 'rxjs/operators';

import { Menu } from '@core/services/types';
import { MenusService } from '@services/system/menus.service';
import { PutpermissionParam, RoleService } from '@services/system/role.service';
import { FooterSubmitComponent } from '@shared/components/footer-submit/footer-submit.component';
import { PageHeaderType, PageHeaderComponent } from '@shared/components/page-header/page-header.component';
import { fnAddTreeDataGradeAndLeaf, fnFlatDataHasParentToTree, fnFlattenTreeDataByDataList } from '@utils/treeTableTools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzWaveModule } from 'ng-zorro-antd/core/wave';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzResultModule } from 'ng-zorro-antd/result';

@Component({
  selector: 'app-set-role',
  templateUrl: './set-role.component.html',
  styleUrls: ['./set-role.component.less'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  imports: [
    PageHeaderComponent,
    NzCardModule,
    NzCheckboxModule,
    FormsModule,
    NzIconModule,
    NzButtonModule,
    NzDividerModule,
    NzResultModule,
    NgTemplateOutlet,
    FooterSubmitComponent,
    NzWaveModule
]
})
export class SetRoleComponent implements OnInit {
  pageHeaderInfo: Partial<PageHeaderType> = {
    title: '设置权限',
    desc: '当前角色：',
    breadcrumb: ['首页', '用户管理', '角色管理', '设置权限']
  };
  authCodeArr: string[] = [];
  permissionList: Array<Menu & { isOpen?: boolean; checked?: boolean }> = [];
  destroyRef = inject(DestroyRef);
  readonly id = input.required<string>(); // 从路由中获取的角色id，ng16支持的新特性
  readonly roleName = input.required<string>(); // 从路由中获取的角色名称，ng16支持的新特性

  private dataService = inject(RoleService);
  private menusService = inject(MenusService);
  private router = inject(Router);
  private message = inject(NzMessageService);
  private cdr = inject(ChangeDetectorRef);

  // 初始化数据
  initpermission(): void {
    // 通过角色id获取这个角色拥有的权限码
    this.dataService
      .getpermissionById(this.id())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(authCodeArr => {
        this.authCodeArr = authCodeArr;
        // 构建权限树结构
        this.permissionList = this.buildpermissionTree(authCodeArr);
        this.cdr.markForCheck();
      });
  }

  // 构建权限树结构
  buildpermissionTree(authCodeArr: string[]): Array<Menu & { isOpen?: boolean; checked?: boolean }> {
    // 基于ABP权限系统构建完整的权限树
    const permissions = [
      {
        id: '1',
        menuName: '基础数据管理',
        code: 'TQMS.BaseData',
        fatherId: null,
        menuType: 'C',
        level: 0,
        path: '',
        children: [
          {
            id: '2',
            menuName: '物料管理',
            code: 'TQMS.BaseData.Materials',
            fatherId: '1',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '3',
                menuName: '创建物料',
                code: 'TQMS.BaseData.Materials.Create',
                fatherId: '2',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '4',
                menuName: '编辑物料',
                code: 'TQMS.BaseData.Materials.Edit',
                fatherId: '2',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '5',
                menuName: '删除物料',
                code: 'TQMS.BaseData.Materials.Delete',
                fatherId: '2',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '6',
            menuName: '工序管理',
            code: 'TQMS.BaseData.Processes',
            fatherId: '1',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '7',
                menuName: '创建工序',
                code: 'TQMS.BaseData.Processes.Create',
                fatherId: '6',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '8',
                menuName: '编辑工序',
                code: 'TQMS.BaseData.Processes.Edit',
                fatherId: '6',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '9',
                menuName: '删除工序',
                code: 'TQMS.BaseData.Processes.Delete',
                fatherId: '6',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '10',
            menuName: '缺陷管理',
            code: 'TQMS.BaseData.Defects',
            fatherId: '1',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '11',
                menuName: '创建缺陷',
                code: 'TQMS.BaseData.Defects.Create',
                fatherId: '10',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '12',
                menuName: '编辑缺陷',
                code: 'TQMS.BaseData.Defects.Edit',
                fatherId: '10',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '13',
                menuName: '删除缺陷',
                code: 'TQMS.BaseData.Defects.Delete',
                fatherId: '10',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '14',
            menuName: '检验标准管理',
            code: 'TQMS.BaseData.InspectionStandards',
            fatherId: '1',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '15',
                menuName: '创建检验标准',
                code: 'TQMS.BaseData.InspectionStandards.Create',
                fatherId: '14',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '16',
                menuName: '编辑检验标准',
                code: 'TQMS.BaseData.InspectionStandards.Edit',
                fatherId: '14',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '17',
                menuName: '删除检验标准',
                code: 'TQMS.BaseData.InspectionStandards.Delete',
                fatherId: '14',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '18',
            menuName: '通用检查项目管理',
            code: 'TQMS.BaseData.GeneralInspectionItems',
            fatherId: '1',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '19',
                menuName: '创建通用检查项目',
                code: 'TQMS.BaseData.GeneralInspectionItems.Create',
                fatherId: '18',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '20',
                menuName: '编辑通用检查项目',
                code: 'TQMS.BaseData.GeneralInspectionItems.Edit',
                fatherId: '18',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '21',
                menuName: '删除通用检查项目',
                code: 'TQMS.BaseData.GeneralInspectionItems.Delete',
                fatherId: '18',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '22',
            menuName: '供应商管理',
            code: 'TQMS.BaseData.Suppliers',
            fatherId: '1',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '23',
                menuName: '创建供应商',
                code: 'TQMS.BaseData.Suppliers.Create',
                fatherId: '22',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '24',
                menuName: '编辑供应商',
                code: 'TQMS.BaseData.Suppliers.Edit',
                fatherId: '22',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '25',
                menuName: '删除供应商',
                code: 'TQMS.BaseData.Suppliers.Delete',
                fatherId: '22',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '26',
        menuName: '检验管理',
        code: 'TQMS.Inspection',
        fatherId: null,
        menuType: 'C',
        level: 0,
        path: '',
        children: [
          {
            id: '27',
            menuName: '检验订单管理',
            code: 'TQMS.Inspection.Orders',
            fatherId: '26',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '28',
                menuName: '创建检验订单',
                code: 'TQMS.Inspection.Orders.Create',
                fatherId: '27',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '29',
                menuName: '编辑检验订单',
                code: 'TQMS.Inspection.Orders.Edit',
                fatherId: '27',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '30',
                menuName: '删除检验订单',
                code: 'TQMS.Inspection.Orders.Delete',
                fatherId: '27',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '31',
                menuName: '执行检验',
                code: 'TQMS.Inspection.Orders.Execute',
                fatherId: '27',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '32',
            menuName: 'IQC检验管理',
            code: 'TQMS.Inspection.IQC',
            fatherId: '26',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '33',
                menuName: '创建IQC检验订单',
                code: 'TQMS.Inspection.IQC.Create',
                fatherId: '32',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '34',
                menuName: '编辑IQC检验订单',
                code: 'TQMS.Inspection.IQC.Edit',
                fatherId: '32',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '35',
                menuName: '删除IQC检验订单',
                code: 'TQMS.Inspection.IQC.Delete',
                fatherId: '32',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '36',
                menuName: '执行IQC检验',
                code: 'TQMS.Inspection.IQC.Execute',
                fatherId: '32',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '37',
        menuName: '不合格品管理',
        code: 'TQMS.NonConforming',
        fatherId: null,
        menuType: 'C',
        level: 0,
        path: '',
        children: [
          {
            id: '38',
            menuName: '不合格品记录',
            code: 'TQMS.NonConforming.Records',
            fatherId: '37',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '39',
                menuName: '创建不合格品记录',
                code: 'TQMS.NonConforming.Records.Create',
                fatherId: '38',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '40',
                menuName: '编辑不合格品记录',
                code: 'TQMS.NonConforming.Records.Edit',
                fatherId: '38',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '41',
                menuName: '删除不合格品记录',
                code: 'TQMS.NonConforming.Records.Delete',
                fatherId: '38',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '42',
            menuName: 'CAPA管理',
            code: 'TQMS.NonConforming.CAPA',
            fatherId: '37',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '43',
                menuName: '创建CAPA',
                code: 'TQMS.NonConforming.CAPA.Create',
                fatherId: '42',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '44',
                menuName: '编辑CAPA',
                code: 'TQMS.NonConforming.CAPA.Edit',
                fatherId: '42',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '45',
                menuName: '删除CAPA',
                code: 'TQMS.NonConforming.CAPA.Delete',
                fatherId: '42',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '46',
                menuName: '审核CAPA',
                code: 'TQMS.NonConforming.CAPA.Approve',
                fatherId: '42',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          }
        ]
      },
      {
        id: '47',
        menuName: '系统配置',
        code: 'TQMS.System',
        fatherId: null,
        menuType: 'C',
        level: 0,
        path: '',
        children: [
          {
            id: '48',
            menuName: '菜单管理',
            code: 'TQMS.System.Menus',
            fatherId: '47',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '49',
                menuName: '创建菜单',
                code: 'TQMS.System.Menus.Create',
                fatherId: '48',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '50',
                menuName: '编辑菜单',
                code: 'TQMS.System.Menus.Edit',
                fatherId: '48',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '51',
                menuName: '删除菜单',
                code: 'TQMS.System.Menus.Delete',
                fatherId: '48',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '52',
            menuName: 'AQL配置',
            code: 'TQMS.System.AQL',
            fatherId: '47',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '53',
                menuName: '创建AQL配置',
                code: 'TQMS.System.AQL.Create',
                fatherId: '52',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '54',
                menuName: '编辑AQL配置',
                code: 'TQMS.System.AQL.Edit',
                fatherId: '52',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '55',
                menuName: '删除AQL配置',
                code: 'TQMS.System.AQL.Delete',
                fatherId: '52',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          },
          {
            id: '56',
            menuName: '抽样方案管理',
            code: 'TQMS.System.SamplingSchemes',
            fatherId: '47',
            menuType: 'C',
            level: 1,
            path: '',
            children: [
              {
                id: '57',
                menuName: '创建抽样方案',
                code: 'TQMS.System.SamplingSchemes.Create',
                fatherId: '56',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '58',
                menuName: '编辑抽样方案',
                code: 'TQMS.System.SamplingSchemes.Edit',
                fatherId: '56',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              },
              {
                id: '59',
                menuName: '删除抽样方案',
                code: 'TQMS.System.SamplingSchemes.Delete',
                fatherId: '56',
                menuType: 'F',
                level: 2,
                path: '',
                children: []
              }
            ]
          }
        ]
      }
    ];

    // 标记权限是否被选中
    const markpermissions = (permissions: Array<Menu & { isOpen?: boolean; checked?: boolean }>) => {
      permissions.forEach(permission => {
        permission.isOpen = false;
        permission.checked = permission.code ? this.authCodeArr.includes(permission.code) : false;
        if (permission.children && permission.children.length > 0) {
          markpermissions(permission.children);
        }
      });
    };

    // 转换fatherId为undefined而不是null，以符合Menu接口
    const convertpermissions = (perms: any[]): any[] => {
      return perms.map(perm => ({
        ...perm,
        fatherId: perm.fatherId === null ? undefined : perm.fatherId,
        children: perm.children ? convertpermissions(perm.children) : []
      }));
    };

    const convertedpermissions = convertpermissions(permissions);
    markpermissions(convertedpermissions);
    return convertedpermissions;
  }

  getRoleName(): void {
    this.pageHeaderInfo = { ...this.pageHeaderInfo, ...{ desc: `当前角色：${this.roleName()}` } };
    this.cdr.markForCheck();
  }

  back(): void {
    this.router.navigateByUrl(`/default/system/role-manager`);
  }

  submit(): void {
    const temp = [...this.permissionList];
    const flatArray = fnFlattenTreeDataByDataList(temp);
    const selectedAuthCodeArray: string[] = [];
    flatArray.forEach(item => {
      if (item['checked']) {
        selectedAuthCodeArray.push(item['code']);
      }
    });
    const param: PutpermissionParam = {
      permCodes: selectedAuthCodeArray,
      roleId: this.id()
    };
    this.dataService
      .updatepermission(param)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.message.success('设置成功，重新登录后生效');
      });
  }

  _onReuseInit(): void {
    this.ngOnInit();
  }

  ngOnInit(): void {
    this.getRoleName();
    this.initpermission();
  }
}
