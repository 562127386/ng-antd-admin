import {Component, Input, OnInit} from "@angular/core";

@Component({
    standalone: false,
    selector: "attachment-select",
    template: `<div style="padding: 20px;">Attachment Select Component</div>`,
    styleUrls: []
})
export class AttachmentSelectComponent implements OnInit {

    @Input() eruptBuildModel: any;

    @Input() eruptFieldModel: any;

    @Input() view: any;

    @Input() value: any;

    constructor() {
    }

    ngOnInit(): void {
    }

    open(path: string): void {
    }
}