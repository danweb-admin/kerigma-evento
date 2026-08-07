import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-politica-privacidade-modal',
  templateUrl: './politica-privacidade-modal.component.html',
  styleUrls: ['./politica-privacidade-modal.component.scss']
})
export class PoliticaPrivacidadeModalComponent {

  @Output() fecharModal = new EventEmitter<void>();

  fechar() {
    this.fecharModal.emit();
  }

}