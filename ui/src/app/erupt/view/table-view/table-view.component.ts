import {Component, inject, OnDestroy, OnInit, TemplateRef, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import { STChange, STColumn, STColumnFilter, STColumnFilterHandle, STData } from "@delon/abc/st";
import { NzMessageService } from "ng-zorro-antd/message";
import { delay, of, Subscription } from "rxjs";

@Component({
    standalone: false,
    selector: "erupt-table-view",
    templateUrl: "./table-view.component.html",
    styleUrls: ["./table-view.component.less"]
})
export class TableViewComponent implements OnInit, OnDestroy {

    constructor(public route: ActivatedRoute) {
    }

    private router$: Subscription;

    public eruptName: string;

    ngOnInit() {
        this.router$ = this.route.params.subscribe(params => {
            this.eruptName = params["name"];
            if(!this.eruptName)
            {// 获取路由data中的entityName
                this.route.data.subscribe(data => {
                    this.eruptName = data['entityName'];
                });
            }
        });
 
      
    }

    ngOnDestroy(): void {
        this.router$.unsubscribe();
    }










    private readonly msg = inject(NzMessageService);
  users: STData[] = [];
  @ViewChild('customFilter', { static: true }) readonly customFilter!: TemplateRef<{
    $implicit: STColumnFilter;
    col: STColumn;
    handle: STColumnFilterHandle;
  }>;
  columns: STColumn[] = [];
 
  close(f: STColumnFilter, handle: STColumnFilterHandle, result: boolean): void {
    this.msg.info(`Process result: ${result}${result ? '(only name 2)' : ''}`);
    f.menus = [{ value: result ? 'name 2' : null }];
    handle.close(result);
  }

  change(e: STChange): void {
    console.log(e);
  }

  
}