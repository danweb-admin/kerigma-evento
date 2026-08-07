import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-sobre-kerigma-modal',
  templateUrl: './sobre-kerigma-modal.component.html',
  styleUrls: ['./sobre-kerigma-modal.component.scss']
})
export class SobreKerigmaModalComponent {

  @Output() fecharModal = new EventEmitter<void>();


  fechar(): void {
    this.fecharModal.emit();
  }

}