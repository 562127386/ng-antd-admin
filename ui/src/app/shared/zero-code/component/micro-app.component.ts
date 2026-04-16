import {AfterViewInit, Component, ElementRef, Input, ViewChild} from '@angular/core';

@Component({
    standalone: false,
    selector: 'erupt-micro-app',
    template: `
        <div style="height: 100%; width: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
            <span>Micro App Component</span>
        </div>
    `,
    styles: []
})
export class EruptMicroAppComponent implements AfterViewInit {

    @Input() url: string | null = null;

    @ViewChild('microApp') microApp!: ElementRef;

    ngAfterViewInit(): void {
    }
}