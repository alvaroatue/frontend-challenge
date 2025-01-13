import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Plant, PlantDashboard } from '../../interfaces/plant';

@Component({
  selector: 'app-edit-plant-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editplantmodal.component.html',
  styleUrls: ['./editplantmodal.component.css']
})
export class EditPlantModalComponent {
  @Input() plant: PlantDashboard | null = null;
  @Output() save = new EventEmitter<PlantDashboard>();
  @Output() close = new EventEmitter<void>();

  plantForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.plantForm = this.fb.group({
      name: ['', [Validators.required]],
      country: ['', [Validators.required]],
      readings: [0, [Validators.min(0)]],
      mediumAlerts: [0, [Validators.min(0)]],
      criticalAlerts: [0, [Validators.min(0)]]
    });
  }

  ngOnChanges() {
    if (this.plant) {
      this.plantForm.patchValue(this.plant);
    }
  }

  onSave() {
    if (this.plantForm.valid) {
      this.save.emit({ ...this.plant, ...this.plantForm.value });
    }
  }

  onClose() {
    this.close.emit();
  }
}