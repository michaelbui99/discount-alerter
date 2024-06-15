import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAlertsComponent } from './list-alerts.component';

describe('ListAlertsComponent', () => {
  let component: ListAlertsComponent;
  let fixture: ComponentFixture<ListAlertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListAlertsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListAlertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
