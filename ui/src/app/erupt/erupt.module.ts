import {NgModule} from "@angular/core";
import {CommonModule} from "@angular/common";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {DragDropModule} from "@angular/cdk/drag-drop";
import {CoreModule} from "@abp/ng.core";
import {DataHandlerService} from "./service/data-handler.service";
import {SyncVirtualScrollDirective} from "@app/shared/zero-code/directive/sync-virtual-scroll.directive";

import {TreeComponent} from "./view/tree/tree.component";
import {TableViewComponent} from "./view/table-view/table-view.component";
import {EditComponent} from "./view/edit/edit.component";
import {TableComponent} from './view/table/table.component';
import {LayoutTreeComponent} from './view/layout-tree/layout-tree.component';
import {ExcelImportComponent} from './components/excel-import/excel-import.component';

import {UiBuildService} from "./service/ui-build.service";

import {CardComponent} from './vis/card/card.component';
import {TagSelectModule} from "@delon/abc/tag-select";
import {NzCodeEditorModule} from "ng-zorro-antd/code-editor";

import {NzPipesModule} from "ng-zorro-antd/pipes";
import {NzImageModule} from "ng-zorro-antd/image";

import {NzQRCodeModule} from "ng-zorro-antd/qr-code";
import {NzRateModule} from "ng-zorro-antd/rate";

import {NzEmptyModule} from "ng-zorro-antd/empty";

import {NzSegmentedModule} from "ng-zorro-antd/segmented";
import {GanttComponent} from "./vis/gantt/gantt.component";
import {NgxGanttModule} from "@worktile/gantt";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";

import {NzCardModule} from "ng-zorro-antd/card";
import {NzIconModule} from "ng-zorro-antd/icon";
import {NzInputModule} from "ng-zorro-antd/input";
import {NzSelectModule} from "ng-zorro-antd/select";
import {NzDatePickerModule} from "ng-zorro-antd/date-picker";
import {NzCheckboxModule} from "ng-zorro-antd/checkbox";
import {NzRadioModule} from "ng-zorro-antd/radio";
import {NzSwitchModule} from "ng-zorro-antd/switch";
import {NzSliderModule} from "ng-zorro-antd/slider";
import {NzCascaderModule} from "ng-zorro-antd/cascader";
import {NzTreeSelectModule} from "ng-zorro-antd/tree-select";
import {NzAutocompleteModule} from "ng-zorro-antd/auto-complete";
import {NzMentionModule} from "ng-zorro-antd/mention";
import {NzTimePickerModule} from "ng-zorro-antd/time-picker";
import {NzUploadModule} from "ng-zorro-antd/upload";
import {NzModalModule} from "ng-zorro-antd/modal";
import {NzDrawerModule} from "ng-zorro-antd/drawer";
import {NzPopconfirmModule} from "ng-zorro-antd/popconfirm";
import {NzPopoverModule} from "ng-zorro-antd/popover";
import {NzTooltipModule} from "ng-zorro-antd/tooltip";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzMenuModule} from "ng-zorro-antd/menu";
import {NzBreadCrumbModule} from "ng-zorro-antd/breadcrumb";
import {NzTabsModule} from "ng-zorro-antd/tabs";
import {NzStepsModule} from "ng-zorro-antd/steps";
import {NzTableModule} from "ng-zorro-antd/table";
import {NzPaginationModule} from "ng-zorro-antd/pagination";
import {NzTreeModule} from "ng-zorro-antd/tree";
import {NzProgressModule} from "ng-zorro-antd/progress";
import {NzSpinModule} from "ng-zorro-antd/spin";
import {NzSkeletonModule} from "ng-zorro-antd/skeleton";
import {NzAlertModule} from "ng-zorro-antd/alert";
import {NzTagModule} from "ng-zorro-antd/tag";
import {NzBadgeModule} from "ng-zorro-antd/badge";
import {NzAvatarModule} from "ng-zorro-antd/avatar";
import {NzCalendarModule} from "ng-zorro-antd/calendar";
import {NzTimelineModule} from "ng-zorro-antd/timeline";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {NzResultModule} from "ng-zorro-antd/result";
import {NzStatisticModule} from "ng-zorro-antd/statistic";
import {NzAnchorModule} from "ng-zorro-antd/anchor";
import {NzAffixModule} from "ng-zorro-antd/affix";
import {NzWatermarkModule} from "ng-zorro-antd/watermark";
import {NzQRCodeModule as NzQRCodeModule2} from "ng-zorro-antd/qr-code";
import {NzResultModule as NzResultModule2} from "ng-zorro-antd/result";
import {NzFormModule} from "ng-zorro-antd/form";

import {STModule} from "@delon/abc/st";
import {STColumn} from "@delon/abc/st";

 import {ViewTypeComponent} from "./components/view-type/view-type.component";
 import {AttachmentSelectComponent} from './components/attachment-select/attachment-select.component';
 import {CodeEditorComponent} from './components/code-editor/code-editor.component';
import { EditTypeComponent } from "./components/edit-type/edit-type.component";
import { EruptIframeComponent } from "@app/shared/zero-code/component/iframe.component";


@NgModule({
    imports: [
       
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        CoreModule,
        DragDropModule,
        TagSelectModule,
        NzCodeEditorModule,
        NzPipesModule,
        NzImageModule,
        NzQRCodeModule,
        NzRateModule,
        NzEmptyModule,
        NzSegmentedModule,
        NgxGanttModule,
        NzButtonModule,
        NzTooltipDirective,
        NzCardModule,
        NzIconModule,
        NzInputModule,
        NzSelectModule,
        NzDatePickerModule,
        NzCheckboxModule,
        NzRadioModule,
        NzSwitchModule,
        NzSliderModule,
        NzCascaderModule,
        NzTreeSelectModule,
        NzAutocompleteModule,
        NzMentionModule,
        NzTimePickerModule,
        NzUploadModule,
        NzModalModule,
        NzDrawerModule,
        NzPopconfirmModule,
        NzPopoverModule,
        NzTooltipModule,
        NzDropDownModule,
        NzMenuModule,
        NzBreadCrumbModule,
        NzTabsModule,
        NzStepsModule,
        NzTableModule,
        NzPaginationModule,
        NzTreeModule,
        NzProgressModule,
        NzSpinModule,
        NzSkeletonModule,
        NzAlertModule,
        NzTagModule,
        NzBadgeModule,
        NzAvatarModule,
        NzCalendarModule,
        NzTimelineModule,
        NzDescriptionsModule,
        NzResultModule,
        NzStatisticModule,
        NzAnchorModule,
        NzAffixModule,
        NzWatermarkModule,
        NzQRCodeModule2,
        NzResultModule2,
        NzFormModule,
        STModule
    ],
    providers: [
        DataHandlerService,
        UiBuildService
    ],
    exports: [
         ViewTypeComponent,
         EditTypeComponent
    ],
    declarations: [
        EruptIframeComponent,
        EditTypeComponent,
         ViewTypeComponent,
         CodeEditorComponent,
         AttachmentSelectComponent,
         ExcelImportComponent,
        EditComponent,
        TreeComponent,
        TableViewComponent,
        TableComponent,
        LayoutTreeComponent,
        CardComponent,
        GanttComponent,
        SyncVirtualScrollDirective
    ]
})
export class EruptModule {
}