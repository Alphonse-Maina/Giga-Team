import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RandrPolicyComponent } from './randr-policy.component';

describe('RandrPolicyComponent', () => {
  let component: RandrPolicyComponent;
  let fixture: ComponentFixture<RandrPolicyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RandrPolicyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RandrPolicyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
