export interface Reading {
    id?: number;
    plantId: number;
    timestamp: string;
    temperature: number;
    pressure: number;
    wingSpeed: number;
    energyLevel: number;
    tension: number;
    carbonMonoxide: number;
    otherGases: number;
    sensorStatus: string;
  }
  