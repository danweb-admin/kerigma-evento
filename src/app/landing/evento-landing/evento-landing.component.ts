import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { EventoService } from 'src/app/admin/services/eventos.service';

@Component({
  selector: 'app-evento-landing',
  templateUrl: './evento-landing.component.html',
  styleUrls: ['./evento-landing.component.scss']
})
export class EventoLandingComponent implements OnInit {
  evento: any;
  showModal = false;
  
  grupos: any[] = [];
  wazeUrl!: SafeResourceUrl;
  menuAberto = false;
  mostrarPolitica = false;
  mostrarSobre = false;
  mostrarConsultaInscricao = false;
  mesmaData = false;
  
  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private service: EventoService,
    
  ) {
    
  }
  
  ngOnInit(): void {
    const slug= this.route.snapshot.paramMap.get('slug');
    
    this.service.getSlug(slug).subscribe(ev => {
      this.evento = ev;
      this.gerarMapaWaze();
      if (this.evento.dataFim === this.evento.dataInicio){
        this.mesmaData = true;
      }
      
    });
    
  }
  
  get nomesEvento(): string[] {
    
    if (this.evento?.id.toUpperCase() === '7CE3BEDA-438F-4B3A-84AD-6E1551447F9F' || this.evento?.id.toUpperCase() === '020C020E-41DC-47F6-BB18-8046B77E00A2') { //NOITE DE LOUVOR 
      return this.evento.nome
      .split('-')
      .map((parte: string) => parte.trim().replace(/\s+/g, ' '))
      .filter((parte: string | any[]) => parte.length > 0);
    }
    
    return [this.evento?.nome || ''];
  }
  
  isMobile(): boolean {
    return window.innerWidth < 768;
  }
  
  gerarMapaWaze(): void {
    if (this.evento?.local?.latitude && this.evento?.local?.longitude) {
      const mapaUrl = `https://embed.waze.com/iframe?zoom=16&lat=${this.evento.local.latitude}&lon=${this.evento.local.longitude}&pin=1&locale=pt-BR`;
      this.wazeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(mapaUrl);
    }
  }
  
  abrirModal() {
    this.showModal = true;
  }
  
  fecharModal() {
    this.showModal = false;
  }
  
  formatarData(data: string | Date): string | null {
    if (!data) return null;
    const d = new Date(data);
    return d.toISOString().split('T')[0]; // retorna yyyy-MM-dd
  }
  
  abrirPolitica() {
    this.mostrarPolitica = true;
  }
  
  fecharPolitica() {
    this.mostrarPolitica = false;
  }
  
  abrirSobre() {
    this.mostrarSobre = true;
  }
  
  
  fecharSobre() {
    this.mostrarSobre = false;
  }
  
  
  abrirConsultaInscricao(): void {
    this.mostrarConsultaInscricao = true;
  }
  
  fecharConsultaInscricao(): void {
    this.mostrarConsultaInscricao = false;
  }
  
  
}
