export interface TrackEventDTO {
  cardId: string;
  eventType: 'view' | 'scan' | 'click' | 'save';
  referrer?: string;
  buttonId?: string;
}

export interface AnalyticsQueryDTO {
  cardId: string;
  rangeDays?: number;
}
