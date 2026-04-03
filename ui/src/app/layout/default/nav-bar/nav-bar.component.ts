import { NgTemplateOutlet } from '@angular/common';
import { Component, OnInit, ChangeDetectionStrategy, inject, DestroyRef, booleanAttribute, input, computed, signal, effect } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, mergeMap, tap } from 'rxjs/operators';

import { TabService } from '@core/services/common/tab.service';
import { Menu } from '@core/services/types';
import { AuthDirective } from '@shared/directives/auth.directive';
import { MenuStoreService } from '@store/common-store/menu-store.service';
import { SplitNavStoreService } from '@store/common-store/split-nav-store.service';
import { ThemeService } from '@store/common-store/theme.service';
import { UserInfoStoreService } from '@store/common-store/userInfo-store.service';
import { fnStopMouseEvent } from '@utils/tools';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzNoAnimationModule } from 'ng-zorro-antd/core/animation';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NzMenuModule, NzNoAnimationModule, NgTemplateOutlet, NzButtonModule, NzIconModule, RouterLink, AuthDirective]
})
export class NavBarComponent implements OnInit {
  readonly isMixinHead = input(false, { transform: booleanAttribute }); // 是混合模式顶部导航
  readonly isMixinLeft = input(false, { transform: booleanAttribute });

  private router = inject(Router);
  private userInfoService = inject(UserInfoStoreService);
  private menuServices = inject(MenuStoreService);
  private splitNavStoreService = inject(SplitNavStoreService);
  private activatedRoute = inject(ActivatedRoute);
  private tabService = inject(TabService);
  private themesService = inject(ThemeService);
  private destroyRef = inject(DestroyRef);

  // Signals for state management
  routerPath = signal(this.router.url);
  menus = signal<Menu[]>([]);
  copyMenus = signal<Menu[]>([]);

  // Computed signals from services
  authCodeArray = computed(() => this.userInfoService.$userInfo().authCode);
  $isNightTheme = computed(() => this.themesService.$isNightTheme());

  // Direct access to service signals (they are already signals, not observables)
  themesOptions = this.themesService.$themesOptions;
  isCollapsed = this.themesService.$isCollapsed;
  isOverMode = this.themesService.$isOverModeTheme;
  // 混合模式下左侧菜单数据源
  leftMenuArray = this.splitNavStoreService.$splitLeftNavArray;

  // Computed signals for derived state
  themesMode = computed(() => this.themesOptions().mode);
  isMixinMode = computed(() => this.themesMode() === 'mixin');

  constructor() {
    this.initMenus();
    this.setupRouterListener();
    this.setupCollapseEffect();
    this.setupThemeEffect();
  }

  private initMenus(): void {
    this.menuServices
      .getMenuArrayStore()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(menusArray => {
        this.menus.set(menusArray);
        this.copyMenus.set(this.cloneMenuArray(menusArray));
        this.clickMenuItem(this.menus());
        this.clickMenuItem(this.copyMenus());
      });
  }

  private setupRouterListener(): void {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        filter((event: NavigationEnd) => event.url !== '/default/refresh-empty'),
        tap(() => {
          // @ts-ignore
          const url = this.activatedRoute.snapshot['_routerState'].url;
          this.routerPath.set(url);

          // 主题切换为混合模式下，设置左侧菜单数据源
          // 如果放在ngInit监听里面，会在混合模式下，刷新完页面切换路由，runOutSideAngular
          if (this.isMixinMode()) {
            this.setMixModeLeftMenu();
          }

          // 更新菜单状态
          //  做一个copyMenus来记录当前menu状态，因为顶部模式时是不展示子menu的，然而主题由顶部模式切换成侧边栏模式，要把当前顶部模式中菜单的状态体现于侧边栏模式的菜单中
          this.clickMenuItem(this.menus());
          this.clickMenuItem(this.copyMenus());

          // 折叠菜单且不是over模式时，关闭菜单
          if (this.isCollapsed() && !this.isOverMode()) {
            this.closeMenuOpen(this.menus());
          }

          // 顶部菜单模式且不是over模式时，关闭菜单。解决顶部模式时，切换tab会有悬浮框菜单的bug
          if (this.themesMode() === 'top' && !this.isOverMode()) {
            this.closeMenu();
          }
        }),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(routeData => {
        const isNewTabDetailPage = routeData['newTab'] === 'true';
        this.routeEndAction(isNewTabDetailPage);
      });
  }

  // 监听折叠菜单事件
  private setupCollapseEffect(): void {
    effect(() => {
      const collapsed = this.isCollapsed();

      if (!collapsed) {
        // 菜单展开
        this.menus.set(this.cloneMenuArray(this.copyMenus()));
        this.clickMenuItem(this.menus());

        // 混合模式下要在点击一下左侧菜单数据源，不然有二级菜单的菜单在折叠状态变为展开时不open
        if (this.themesMode() === 'mixin') {
          this.clickMenuItem(this.leftMenuArray());
        }
      } else {
        // 菜单收起
        this.copyMenus.set(this.cloneMenuArray(this.menus()));
        this.closeMenuOpen(this.menus());
      }
    });
  }

  // Effect to handle theme mode changes
  private setupThemeEffect(): void {
    effect(() => {
      const mode = this.themesMode();
      const overMode = this.isOverMode();

      if (mode === 'top' && !overMode) {
        this.closeMenu();
      }
    });
  }

  // 设置混合模式时，左侧菜单"自动分割菜单"模式的数据源
  setMixModeLeftMenu(): void {
    const menus = this.menus();
    menus.forEach(item => {
      if (item.selected) {
        this.splitNavStoreService.$splitLeftNavArray.set(item.children || []);
      }
    });
  }

  // 深拷贝克隆菜单数组
  cloneMenuArray(sourceMenuArray: Menu[], target: Menu[] = []): Menu[] {
    sourceMenuArray.forEach(item => {
      const obj: Menu = { menuName: '', menuType: 'C', path: '', id: -1, fatherId: -1, code: '' };
      for (const i in item) {
        if (item.hasOwnProperty(i)) {
          // @ts-ignore
          if (Array.isArray(item[i])) {
            // @ts-ignore
            obj[i] = this.cloneMenuArray(item[i]);
          } else {
            // @ts-ignore
            obj[i] = item[i];
          }
        }
      }
      target.push({ ...obj });
    });
    return target;
  }

  // 混合模式点击一级菜单，要让一级菜单下的第一个子菜单被选中
  changTopNav(index: number): void {
    // 当前选中的第一级菜单对象
    const currentTopNav = this.menus()[index];
    let currentLeftNavArray = currentTopNav.children || [];
    // 如果一级菜单下有二级菜单
    if (currentLeftNavArray.length > 0) {
      // 当前左侧导航数组
      /*添加了权限版*/
      // 获取有权限的二级菜单集合（在左侧展示的）
      currentLeftNavArray = currentLeftNavArray.filter(item => {
        return true;//add by tca0309 临时所有权限
        return this.authCodeArray().includes(item.code!);
      });
      // 如果第一个二级菜单，没有三级菜单
      if (currentLeftNavArray.length > 0 && !currentLeftNavArray[0].children) {
        this.router.navigateByUrl(currentLeftNavArray[0].path!);
      } else if (currentLeftNavArray.length > 0 && currentLeftNavArray[0].children) {
        // 如果有三级菜单，则跳转到第一个三级菜单
        this.router.navigateByUrl(currentLeftNavArray[0].children[0].path!);
      }
    }
    this.splitNavStoreService.$splitLeftNavArray.set(currentLeftNavArray);
  }

  flatMenu(menus: Menu[], routePath: string): void {
    menus.forEach(item => {
      item.selected = false;
      item.open = false;
      
      // 精确匹配当前菜单项
      if (routePath === item.path && !item.newLinkFlag) {
        item.selected = true;
        item.open = true;
      } else if (routePath.startsWith(item.path + '/') && !item.newLinkFlag) {
        // 匹配子路径
        item.open = true;
      }

      // 递归处理子菜单
      let hasSelectedChild = false;
      if (!!item.children && item.children.length > 0) {
        this.flatMenu(item.children, routePath);
        // 检查是否有子菜单被选中
        hasSelectedChild = item.children.some(child => child.selected || child.open);
      }

      // 如果有子菜单被选中，父菜单需要展开
      if (hasSelectedChild) {
        item.open = true;
      }
    });
  }

  clickMenuItem(menus: Menu[]): void {
    if (!menus) {
      return;
    }
    const routerPath = this.routerPath();
    const index = routerPath.indexOf('?') === -1 ? routerPath.length : routerPath.indexOf('?');
    const routePath = routerPath.substring(0, index);
    this.flatMenu(menus, routePath);
  }

  // 改变当前菜单展示状态
  changeOpen(currentMenu: Menu, allMenu: Menu[]): void {
    allMenu.forEach(item => {
      item.open = false;
    });
    currentMenu.open = true;
  }

  closeMenuOpen(menus: Menu[]): void {
    menus.forEach(menu => {
      menu.open = false;
      if (menu.children && menu.children.length > 0) {
        this.closeMenuOpen(menu.children);
      } else {
        return;
      }
    });
  }

  changeRoute(e: MouseEvent, menu: Menu): void {
    if (menu.newLinkFlag) {
      fnStopMouseEvent(e);
      window.open(menu.path, '_blank');
      return;
    }
    //this.router.navigateByUrl(menu.path);
//上面一行也可以跳转  但是就是不安全和方便！！

    // 假设 menu 是当前点击的菜单对象
    const { path, queryParams } = this.parseMenuPath(menu.path);
    // 用 navigate 跳转，自动拼接参数
    this.router.navigate(path, {
      queryParams: queryParams
    });

  }

  /**
 * 解析带查询参数的路由地址  add by tca 20260327
 * @param fullPath 完整路径，如 /default/base-data/xxx?a=1&b=2
 * @returns { path: string[], queryParams: object }
 */
parseMenuPath(fullPath: string): { path: string[], queryParams: Record<string, string> } {
  const [pathPart, queryPart] = fullPath.split('?');
  // 拆分路径为数组（支持多级路由）
  const path = pathPart.split('/').filter(Boolean);
  // 解析查询参数
  const queryParams: Record<string, string> = {};
  if (queryPart) {
    new URLSearchParams(queryPart).forEach((v, k) => {
      queryParams[k] = v;
    });
  }
  return { path, queryParams };
}

  closeMenu(): void {
    this.clickMenuItem(this.menus());
    this.clickMenuItem(this.copyMenus());
    this.closeMenuOpen(this.menus());
  }

  routeEndAction(isNewTabDetailPage = false): void {
    let route = this.activatedRoute;
    while (route.firstChild) {
      route = route.firstChild;
    }

    let title = 'TQMS';
    if (typeof route.routeConfig?.title === 'string') {
      title = route.routeConfig?.title;
    }

    this.tabService.addTab(
      {
        snapshotArray: [route.snapshot],
        title,
        path: this.routerPath()
      },
      isNewTabDetailPage
    );
    this.tabService.findIndex(this.routerPath());
    // 混合模式时，切换tab，让左侧菜单也相应变化
    this.setMixModeLeftMenu();
  }

  ngOnInit(): void {
    this.routeEndAction();
  }
}
