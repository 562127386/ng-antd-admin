import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {EruptBuildModel} from "../../model/erupt-build.model";
import {Vis} from "../../model/erupt.model";
import {SelectMode} from "../../model/erupt.enum";

@Component({
    standalone: false,
    selector: 'vis-gantt',
    template: `
        <div style="height: 100%; width: 100%; background: #f0f0f0; display: flex; align-items: center; justify-content: center;">
            <span>Gantt Component</span>
        </div>
    `,
    styleUrls: ['./gantt.component.less']
})
export class GanttComponent implements OnChanges, OnInit {

    @Input() eruptBuildModel!: EruptBuildModel;

    @Input() data: any[] = [];

    @Input() vis!: Vis;

    @Input() selectionMode: SelectMode | null = null;

    @Output() onEdit = new EventEmitter<any>();

    @Output() onUpdate = new EventEmitter<any>();

    @Output() onSelectionChange = new EventEmitter<any[]>();

    constructor() {
    }

    ngOnInit(): void {
    }

    ngOnChanges(changes: SimpleChanges): void {
    }

    protected readonly FieldVisibility = {EXCLUDE: 'EXCLUDE'};
    protected readonly SelectMode = SelectMode;
}