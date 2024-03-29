/**
 * A single tab page. It renders the passed template
 * via the @Input properties by using the ngTemplateOutlet
 * and ngTemplateOutletContext directives.
 *
 * Author: Ismael Lourenço
 */

import { Component, Input } from '@angular/core';

@Component({
  selector: 'tab',
  styles: [
    `
    .pane{
      padding: 1em;
    }
  `
  ],
  template: `
    <div *ngIf="active" class="pane">
      <ng-content></ng-content>
    </div>
  `
})
export class TabComponent {
  @Input('tabTitle') title: any;
  @Input() active = false;
}
