import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPlantModalComponent } from './editplantmodal.component';

describe('EditPlantModalComponent', () => {
  let component: EditPlantModalComponent;
  let fixture: ComponentFixture<EditPlantModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditPlantModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPlantModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
