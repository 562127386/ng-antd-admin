import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-layout-tree',
    template: `<div style="padding: 20px;">Layout Tree Component</div>`
})
export class LayoutTreeComponent implements OnInit {

    @Input() eruptModel: any;

    @Output() trigger = new EventEmitter<string[]>();

    selectedKeys: any[] = [];

    constructor() {
    }

    ngOnInit(): void {
    }
}