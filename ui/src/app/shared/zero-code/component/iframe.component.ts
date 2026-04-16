import {Component, Input, OnInit} from '@angular/core';

@Component({
    standalone: false,
    selector: 'erupt-iframe',
    template: `
        <div style="height: 100%; width: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
            <span>Iframe Component</span>
        </div>
    `,
    styles: []
})
export class EruptIframeComponent implements OnInit {

    @Input() url: string | null | undefined= null;

    @Input() height: string | null = null;

    @Input() width: string | null = null;

    ngOnInit(): void {
    }
}