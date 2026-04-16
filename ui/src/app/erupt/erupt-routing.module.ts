import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TableViewComponent} from "./view/table-view/table-view.component";
import {TreeComponent} from "./view/tree/tree.component";
import {EruptModule} from "./erupt.module";
import {CoreModule} from "@abp/ng.core";

const routes: Routes = [
    {
            path: 'table/attendance-judgment-record',
            title: '考勤判定记录',
            data: { key: 'attendance-judgment-record' ,entityName:'attendance-judgment-record'},
            component: TableViewComponent
    },
    {
            path: 'table/attendance-statistics',
            title: '考勤统计',
            data: { key: 'attendance-statistics' ,entityName:'attendance-statistics'},
            component: TableViewComponent
    },
    {
            path: 'table/Attendance-Record',
            title: '考勤原始记录',
            data: { key: 'Attendance-Record' ,entityName:'Attendance-Record'},
            component: TableViewComponent
    },
        {
            path: 'table/Scheduling-Rule',
            title: '考勤规则',
            data: { key: 'Scheduling-Rule' ,entityName:'Scheduling-Rule'},
            component: TableViewComponent
    },

    {path: "table/:name", title: '考勤记录',data: { key: 'tables' }, component: TableViewComponent},

    {path: "tree/:name", component: TreeComponent}
];

@NgModule({
    imports: [RouterModule.forChild(routes), EruptModule, CoreModule],
    exports: [RouterModule]
})
export class EruptRoutingModule {
}