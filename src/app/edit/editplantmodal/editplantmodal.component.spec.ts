import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditplantmodalComponent } from './editplantmodal.component';

describe('EditplantmodalComponent', () => {
  let component: EditplantmodalComponent;
  let fixture: ComponentFixture<EditplantmodalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditplantmodalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditplantmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
