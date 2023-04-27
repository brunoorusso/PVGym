/**
 * Author: Ismael Lourenço
 * This component represents a reusable and customizable modal in an Angular application.
 * It accepts input properties for modal title and visibility state, as well as output events
 * for handling visibility changes and save actions. The component provides methods for closing
 * the modal and triggering save actions.
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.css']
})
export class ModalComponent {

  @Input() title = 'Modal Title';
  @Input() visible = false;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() save = new EventEmitter<void>();

  /*
  * Close the modal and emit the visibility state change.
  */
  closeModal() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  /*
  * Trigger the save event.
  */
  saveModal() {
    this.save.emit();
  }

}
