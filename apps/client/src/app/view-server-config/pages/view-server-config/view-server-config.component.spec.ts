import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewServerConfigComponent } from './view-server-config.component';

describe('ViewServerConfigComponent', () => {
  let component: ViewServerConfigComponent;
  let fixture: ComponentFixture<ViewServerConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewServerConfigComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ViewServerConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
