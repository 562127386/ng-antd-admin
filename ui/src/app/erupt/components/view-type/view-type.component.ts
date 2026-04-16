import {Component, Input, OnInit} from "@angular/core";

@Component({
    standalone: false,
    selector: "view-type",
    template: `<div style="padding: 20px;">View Type Component</div>`,
    styleUrls: ["./view-type.component.less"]
})
export class ViewTypeComponent implements OnInit {

    @Input() eruptBuildModel: any;

    @Input() eruptFieldModel: any;

    @Input() view: any;

    @Input() value: any;

    @Input() onlyRead: boolean = false;

    constructor() {
    }

    ngOnInit(): void {
    }
}