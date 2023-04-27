/**
 * Author: Ismael Lourenço
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

  toggleEdit(): void {
    this.editing = !this.editing;
  }

  save(): void {
    this.onSave.emit(this.editedText);
    this.toggleEdit();
  }
}
