import {Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {EruptBuildModel} from "../../model/erupt-build.model";
import {Subscription} from "rxjs";
import {NzMessageService} from "ng-zorro-antd/message";
import {NzModalService} from "ng-zorro-antd/modal";
import {Scene} from "../../model/erupt.enum";
import {DataService} from "@app/shared/zero-code/data.service";
import {AppViewService} from "@app/shared/zero-code/app-view.service";

@Component({
    standalone: false,
    selector: "erupt-tree",
    template: `<div style="padding: 20px;">Tree Component</div>`,
    styleUrls: ["./tree.component.less"]
})
export class TreeComponent implements OnInit, OnDestroy {

    eruptName: string = '';

    eruptBuildModel: EruptBuildModel | null = null;

    showEdit: boolean = false;

    loading = false;

    treeLoading = false;

    behavior: Scene = Scene.ADD;

    searchValue: string = '';

    nodes: any[] = [];

    dataLength: number = 0;

    selectLeaf: boolean = false;

    private router$: Subscription | null = null;

    private currentKey: string = '';

    treeScrollTop: number = 0;

    @ViewChild("treeDiv", {static: false})
    treeDiv?: ElementRef;

    constructor(private dataService: DataService,
                public route: ActivatedRoute,
                @Inject(NzMessageService)
                private msg: NzMessageService,
                private appViewService: AppViewService,
                @Inject(NzModalService)
                private modal: NzModalService) {
    }

    ngOnInit(): void {
        this.router$ = this.route.params.subscribe((params: any) => {
            this.eruptBuildModel = null;
            this.eruptName = params.name;
            this.currentKey = '';
            this.showEdit = false;
        });
    }

    addBlock(callback?: Function): void {
        this.showEdit = true;
        this.loading = true;
        this.selectLeaf = false;
        this.behavior = Scene.ADD;
    }

    ngOnDestroy(): void {
        if (this.router$) {
            this.router$.unsubscribe();
        }
    }
}