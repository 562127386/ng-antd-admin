import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzIconModule } from 'ng-zorro-antd/icon';

interface TreeNode {
  title: string;
  key: string;
  children?: TreeNode[];
  isLeaf?: boolean;
  disabled?: boolean;
  expanded?: boolean;
}

@Component({
  selector: 'abp-lookup-tree',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTreeModule,
    NzButtonModule,
    NzModalModule,
    NzInputModule,
    NzSpaceModule,
    NzSpinModule,
    NzIconModule
  ],
  template: `
    <div class="lookup-tree-container">
      <div class="lookup-tree-input" (click)="openTreeModal()">
        <input
          nz-input
          [value]="displayValue"
          [placeholder]="placeholder || '请选择'"
          readonly
          style="cursor: pointer;" />
        <span class="lookup-tree-icon" (click)="openTreeModal()">
          <span nz-icon nzType="search"></span>
        </span>
      </div>

      <!-- Tree Modal -->
      <nz-modal
        [(nzVisible)]="modalVisible"
        [nzTitle]="title || '选择'"
        [nzWidth]="600"
        [nzFooter]="modalFooter">
        <div class="tree-modal-content">
          <div class="search-box">
            <input
              nz-input
              [(ngModel)]="searchValue"
              (input)="onSearch()"
              placeholder="搜索..." />
          </div>
          
          <div class="tree-container">
            <nz-spin [nzSpinning]="loading">
              <nz-tree
                [nzData]="treeData"
                [nzCheckable]="multiple"
                [nzExpandedKeys]="expandedKeys"
                [nzCheckedKeys]="checkedKeys"
                (nzExpandChange)="onExpandChange($event)"
                (nzClick)="onNodeClick($event)">
              </nz-tree>
            </nz-spin>
          </div>
        </div>
      </nz-modal>
    </div>
  `,
  styles: [`
    .lookup-tree-container {
      position: relative;
    }
    .lookup-tree-input {
      position: relative;
    }
    .lookup-tree-icon {
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
    }
    .tree-modal-content {
      max-height: 500px;
      overflow: auto;
    }
    .search-box {
      margin-bottom: 16px;
    }
    .tree-container {
      max-height: 400px;
      overflow: auto;
    }
  `]
})
export class LookupTreeComponent implements OnInit {
  @Input() title: string = '';
  @Input() placeholder: string = '';
  @Input() multiple: boolean = false;
  @Input() data: any[] = [];
  @Input() value: any;
  @Input() loading: boolean = false;

  @Output() valueChange = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();

  modalVisible = false;
  treeData: TreeNode[] = [];
  checkedKeys: string[] = [];
  expandedKeys: string[] = [];
  searchValue: string = '';
  displayValue: string = '';

  constructor() {}

  ngOnInit(): void {
    this.initializeTreeData();
    this.updateDisplayValue();
  }

  private initializeTreeData(): void {
    this.treeData = this.convertToTreeNodes(this.data);
    if (this.value) {
      if (this.multiple) {
        if (Array.isArray(this.value)) {
          this.checkedKeys = this.value.map(item => item.toString());
        }
      } else {
        this.checkedKeys = [this.value.toString()];
      }
    }
  }

  private convertToTreeNodes(data: any[]): TreeNode[] {
    return data.map(item => {
      const node: TreeNode = {
        title: item.title || item.name || item.label,
        key: item.id || item.key || item.value,
        isLeaf: !item.children || item.children.length === 0,
        expanded: true
      };
      
      if (item.children && item.children.length > 0) {
        node.children = this.convertToTreeNodes(item.children);
      }
      
      return node;
    });
  }

  openTreeModal(): void {
    this.modalVisible = true;
  }

  onSearch(): void {
    // Implement search logic
    console.log('Searching for:', this.searchValue);
  }

  onExpandChange(event: any): void {
    const expanded = event.event === 'expand';
    const node = event.node;
    if (expanded) {
      this.expandedKeys.push(node.key);
    } else {
      this.expandedKeys = this.expandedKeys.filter(key => key !== node.key);
    }
  }

  onNodeClick(event: any): void {
    if (!this.multiple) {
      this.value = event.node.key;
      this.displayValue = event.node.title;
      this.valueChange.emit(this.value);
      this.selectionChange.emit({ value: this.value, label: this.displayValue });
      this.modalVisible = false;
    }
  }

  get modalFooter() {
    return [
      {
        label: '取消',
        onClick: () => {
          this.modalVisible = false;
          return false;
        }
      },
      {
        label: '确定',
        type: 'primary' as const,
        onClick: () => {
          this.onConfirm();
          return false;
        }
      }
    ];
  }

  onConfirm(): void {
    if (this.multiple) {
      this.value = this.checkedKeys;
      // Get display values for selected keys
      const selectedNodes = this.getNodesByKeys(this.checkedKeys);
      this.displayValue = selectedNodes.map(node => node.title).join(', ');
    } else {
      if (this.checkedKeys.length > 0) {
        this.value = this.checkedKeys[0];
        const node = this.getNodeByKey(this.checkedKeys[0]);
        this.displayValue = node?.title || '';
      }
    }
    
    this.valueChange.emit(this.value);
    this.selectionChange.emit({ value: this.value, label: this.displayValue });
    this.modalVisible = false;
  }

  private getNodesByKeys(keys: string[]): TreeNode[] {
    const nodes: TreeNode[] = [];
    
    const findNode = (tree: TreeNode[], key: string): TreeNode | null => {
      for (const node of tree) {
        if (node.key === key) {
          return node;
        }
        if (node.children) {
          const found = findNode(node.children, key);
          if (found) {
            return found;
          }
        }
      }
      return null;
    };
    
    for (const key of keys) {
      const node = findNode(this.treeData, key);
      if (node) {
        nodes.push(node);
      }
    }
    
    return nodes;
  }

  private getNodeByKey(key: string): TreeNode | null {
    return this.getNodesByKeys([key])[0] || null;
  }

  private updateDisplayValue(): void {
    if (this.value) {
      if (this.multiple && Array.isArray(this.value)) {
        const selectedNodes = this.getNodesByKeys(this.value.map(v => v.toString()));
        this.displayValue = selectedNodes.map(node => node.title).join(', ');
      } else {
        const node = this.getNodeByKey(this.value.toString());
        this.displayValue = node?.title || '';
      }
    }
  }
}
