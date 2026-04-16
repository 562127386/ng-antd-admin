import {Component, EventEmitter, inject, Inject, Input, OnInit, Output, ViewChild} from "@angular/core";
import {Scene} from "../../model/erupt.enum";
import {EruptBuildModel} from "../../model/erupt-build.model";
import {DataHandlerService} from "../../service/data-handler.service";
//import {EditTypeComponent} from "../../components/edit-type/edit-type.component";
//import {I18NService} from "@core";
import {NzMessageService} from "ng-zorro-antd/message";
import { DataService } from "@app/shared/zero-code/data.service";
import { LocalizationService } from "@abp/ng.core";
import { EditTypeComponent } from "@app/erupt/components/edit-type/edit-type.component";

@Component({
    standalone: false,
    selector: "erupt-edit",
    templateUrl: "./edit.component.html",
    styleUrls: ["./edit.component.less"]
})
export class EditComponent implements OnInit {

    loading: boolean = false;

    @Input() behavior: Scene = Scene.ADD;

    @Output() save = new EventEmitter();

    @Input() eruptBuildModel: EruptBuildModel;

    @Input() id: any;

    @Input() readonly: boolean = false;

    @Input() header: object = {};

    @ViewChild("eruptEdit", {static: false}) eruptEditComponent: EditTypeComponent;
    l = inject(LocalizationService);// 多语言
    constructor(
        @Inject(NzMessageService)
        private msg: NzMessageService,
        private dataService: DataService,
        //private i18n: I18NService,
        private dataHandlerService: DataHandlerService) {

    }

    ngOnInit() {
        this.dataHandlerService.emptyEruptValue(this.eruptBuildModel);
        if (this.behavior == Scene.ADD) {
            this.loading = true;
            this.dataService.getInitValue(this.eruptBuildModel.eruptModel.eruptName, '', this.header).subscribe(data => {
                this.dataHandlerService.objectToEruptValue(data, this.eruptBuildModel);
                this.loading = false;
            });
        } else {
            this.loading = true;
            this.dataService.get(this.eruptBuildModel.eruptModel.eruptName, this.id).subscribe(data => {
                this.dataHandlerService.objectToEruptValue(data, this.eruptBuildModel);
                this.loading = false;
            });
        }
    }

    beforeSaveValidate(): boolean {
        if (this.loading) {
            this.msg.warning(this.l.instant('global.update.loading.hint'));
            return false;
        } else {
            return this.eruptEditComponent.eruptEditValidate();
        }
    }


}
