import { computed, Directive, inject, input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';

import { UserInfoStoreService } from '@store/common-store/userInfo-store.service';

@Directive({
  selector: '[appAuth]',
  standalone: true
})
export class AuthDirective implements OnInit {
  codeArray = computed(() => {
    return this.userInfoService.$userInfo().authCode;
  });

  private userInfoService = inject(UserInfoStoreService);
  private templateRef = inject(TemplateRef);
  private viewContainerRef = inject(ViewContainerRef);

  appAuth = input.required<string>();

  ngOnInit(): void {
    if (!this.appAuth()) {
      this.show(true);
      return;
    }
    // console.warn("99999999999999999999999999");
    // console.warn(this.codeArray());
    // console.warn(this.appAuth());
    //   console.warn(this.codeArray().includes(this.appAuth()));
    this.codeArray().includes(this.appAuth()) ? this.show(true) : this.show(false);
  }

  private show(hasAuth: boolean): void {
    hasAuth ? this.viewContainerRef.createEmbeddedView(this.templateRef) : this.viewContainerRef.clear();
  }
}
