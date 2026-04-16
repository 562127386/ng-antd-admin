import {Component, Input, OnInit} from '@angular/core';

@Component({
    standalone: false,
    selector: 'vis-card',
    template: `
        <div style="height: 100%; width: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
            <span>Card Component</span>
        </div>
    `,
    styleUrls: ['./card.component.less']
})
export class CardComponent implements OnInit {

    @Input() eruptBuildModel: any;

    @Input() data: any[] = [];

    @Input() vis: any;

    @Input() selectionMode: any;

    columnMap: Map<string, any> = new Map();

    constructor() {
    }

    ngOnInit(): void {
    }
}