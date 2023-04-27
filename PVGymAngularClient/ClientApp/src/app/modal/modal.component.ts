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

  closeModal() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  saveModal() {
    this.save.emit();
  }

}
