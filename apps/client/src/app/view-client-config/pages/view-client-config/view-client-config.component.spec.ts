import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewClientConfigComponent } from './view-client-config.component';

describe('ViewClientConfigComponent', () => {
  let component: ViewClientConfigComponent;
  let fixture: ComponentFixture<ViewClientConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewClientConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewClientConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
