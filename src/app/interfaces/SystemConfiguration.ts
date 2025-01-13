export interface SystemConfiguration {
    id?: number;
    configKey: string;
    configValue: string;
    description: string;
    lastUpdated: Date;
    updatedByUserId: number;
  }