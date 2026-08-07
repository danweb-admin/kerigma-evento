import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SobreKerigmaModalComponent } from './sobre-kerigma-modal.component';

describe('SobreKerigmaModalComponent', () => {
  let component: SobreKerigmaModalComponent;
  let fixture: ComponentFixture<SobreKerigmaModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SobreKerigmaModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SobreKerigmaModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
