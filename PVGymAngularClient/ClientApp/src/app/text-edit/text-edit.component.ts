/**
 * Author: Ismael Lourenço
 * This component represents an editable text element in an Angular application.
 * It accepts input properties for the initial text, element type, and editing state. The component
 * provides functionality for toggling between editing and non-editing states, and emits an event
 * with the updated text when the user saves the changes. This is a reusable component for creating
 * inline editable text elements.
 */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-text-edit',
  templateUrl: './text-edit.component.html',
  styleUrls: ['./text-edit.component.css']
})
export class TextEditComponent implements OnInit {

  @Input() text!: string;
  @Input() elementType: 'p' | 'h4' = 'p';
  @Output() onSave: EventEmitter<string> = new EventEmitter();
  @Input() editing = false;
  editedText!: string;

  constructor() { }

  ngOnInit(): void {
    this.editedText = this.text;
  }

  /*
  * This method toggles the editing state of the component.
  */
  toggleEdit(): void {
    this.editing = !this.editing;
  }

  /*
  * This method saves the edited text and emits an event with the updated text.
  */
  save(): void {
    this.onSave.emit(this.editedText);
    this.toggleEdit();
  }
}
