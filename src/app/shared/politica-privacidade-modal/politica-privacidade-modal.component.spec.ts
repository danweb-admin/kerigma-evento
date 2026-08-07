import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PoliticaPrivacidadeModalComponent } from './politica-privacidade-modal.component';

describe('PoliticaPrivacidadeModalComponent', () => {
  let component: PoliticaPrivacidadeModalComponent;
  let fixture: ComponentFixture<PoliticaPrivacidadeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PoliticaPrivacidadeModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PoliticaPrivacidadeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
