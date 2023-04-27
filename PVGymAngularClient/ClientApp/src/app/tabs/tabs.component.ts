/**
 * The main component that renders single TabComponent
 * instances.
 */

import {
  Component,
  ContentChildren,
  QueryList,
  AfterContentInit
} from '@angular/core';

import { TabComponent } from './tab.component';

@Component({
  selector: 'tab-group',
  template: `
  <div class="tabs-wrapper">
    <ul class="nav nav-tabs">
     <ng-container *ngFor="let tab of tabs; let isLast=last">
          <li (click)="selectTab(tab)" [class.active]="tab.active">
            <p [class.tab-bold]="tab.active" style="margin: 10px">{{tab.title}}</p>
          </li>
          <span *ngIf="!isLast" class="tab-divider"></span>
      </ng-container>
    </ul>
    </div>
    <ng-content></ng-content>
  `,
  styles: [
    `
    .tabs-wrapper {
      display: flex;
      border: 1px solid #ccc;
      border-radius: 4px;
      padding: 10px;
    }
    .nav-tabs {
      display: flex;
      border-bottom: none;
    }
    .tab-close {
      color: gray;
      text-align: right;
      cursor: pointer;
    }
    .tab-text {
      margin: 10;
    }

    .tab-bold {
      font-weight: bold;
    }
    .tab-divider { 
      width: 1px;
      background-color: #ccc;
      margin: 0 5px;
    }
    `
  ]
})
export class TabsComponent implements AfterContentInit {

  @ContentChildren(TabComponent) tabs = new QueryList<TabComponent>();

  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab) => tab.active);

    // if there is no active tab set, activate the first
    if (activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }

  selectTab(tab: TabComponent) {
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);

    // activate the tab the user has clicked on.
    tab.active = true;
  }
}
