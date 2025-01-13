import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { SidenavComponent } from '../sidenav/sidenav.component';
import { PlantService } from '../../services/plant.service';
import { ReadingService } from '../../services/reading.service';
import { AlertService } from '../../services/alert.service';
import { Plant, PlantDashboard } from '../../interfaces/plant';
import { Reading } from '../../interfaces/reading';
import { Alert } from '../../interfaces/alert';
import { forkJoin } from 'rxjs';
import { EditPlantModalComponent } from "../../edit/editplantmodal/editplantmodal.component";
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NavbarComponent,
    SidenavComponent,
    EditPlantModalComponent
],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  plants: PlantDashboard[] = [];
  dashboardSummary = {
    totalReadings: 0,
    mediumAlerts: 0,
    criticalAlerts: 0,
    disabledSensors: 0
  };
  loading = true;
  selectedPlant: PlantDashboard | null = null;

  constructor(
    private plantService: PlantService,
    private readingService: ReadingService,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    
    forkJoin({
      plants: this.plantService.getPlants(),
      readings: this.readingService.getReadings(),
      alerts: this.alertService.getAlerts()
    }).subscribe({
      next: ({ plants, readings, alerts }) => {
        const disabledSensors = readings.filter(r => r.sensorStatus === 'DISABLED').length;
        const mediumAlerts = alerts.filter(a => a.alertType === 'MEDIUM');
        const criticalAlerts = alerts.filter(a => a.alertType === 'CRITICAL');
        
        this.plants = plants.map((plant: Plant) => {
          const plantReadings = readings.filter(r => r.plantId === plant.id);
          return {
            ...plant,
            readings: plantReadings.length,
            mediumAlerts: mediumAlerts.filter(a => a.plantId === plant.id).length,
            criticalAlerts: criticalAlerts.filter(a => a.plantId === plant.id).length
          } as PlantDashboard;
        });
  
        this.dashboardSummary = {
          totalReadings: readings.filter(r => r.sensorStatus !== 'DISABLED').length,
          mediumAlerts: mediumAlerts.length,
          criticalAlerts: criticalAlerts.length,
          disabledSensors
        };
  
        this.loading = false;
      },
      error: (error: any) => {
        console.error('Error loading dashboard data:', error);
        this.loading = false;
      }
    });
  }

  onPlantAction(action: string, plant: PlantDashboard | null): void {
    switch (action) {
      case 'create':
        this.selectedPlant = {
          id: undefined,
          name: '',
          country: '',
          readings: 0,
          mediumAlerts: 0,
          criticalAlerts: 0
        };
        break;
      case 'edit':
        this.selectedPlant = plant;
        break;
      case 'delete':
        if (plant && plant.id) {
          this.plantService.deletePlant(plant.id).subscribe({
            next: () => {
              this.plants = this.plants.filter(p => p.id !== plant.id);
            },
            error: (error: any) => {
              console.error('Error deleting plant:', error);
            }
          });
        }
        break;
    }
  }

  onSavePlant(updatedPlant: PlantDashboard): void {
    if (updatedPlant.id) {
      this.plantService.updatePlant(updatedPlant.id, updatedPlant).subscribe({
        next: () => {
          this.plants = this.plants.map(p => p.id === updatedPlant.id ? {
            ...p,
            name: updatedPlant.name,
            country: updatedPlant.country,
            readings: updatedPlant.readings,
            mediumAlerts: updatedPlant.mediumAlerts,
            criticalAlerts: updatedPlant.criticalAlerts
          } : p);
          this.selectedPlant = null;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error updating plant:', error);
          alert(`Error updating plant: ${error.message || error}`);
        }
      });
    } else {
      this.plantService.addPlant(updatedPlant).subscribe({
        next: (newPlant) => {
          const newPlantDashboard: PlantDashboard = {
            ...newPlant,
            readings: updatedPlant.readings,
            mediumAlerts: updatedPlant.mediumAlerts,
            criticalAlerts: updatedPlant.criticalAlerts
          };
          this.plants.push(newPlantDashboard);
          this.selectedPlant = null;
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error adding plant:', error);
          alert(`Error adding plant: ${error.message || error}`);
        }
      });
    }
  }

  onCloseModal(): void {
    this.selectedPlant = null;
  }
}