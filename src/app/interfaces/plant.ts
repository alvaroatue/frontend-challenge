export interface Plant {
  id?: number;
  name: string;
  country: string;
}

  export interface PlantDashboard extends Plant {
    readings: number;
    mediumAlerts: number;
    criticalAlerts: number;
  }