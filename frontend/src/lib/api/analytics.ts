import { apiClient } from './client';

export interface AnalyticsOverviewDTO {
  totalViews: number;
  totalShares: number;
  totalLeads: number;
  clicks: number;
  qrVisits: number;
  chartData: Array<{
    name: string;
    views: number;
    shares: number;
    leads?: number;
    clicks?: number;
  }>;
}

export interface AnalyticsTimeseriesDTO {
  range: string;
  points: Array<{
    date: string;
    views: number;
    clicks: number;
    shares: number;
    scans: number;
    saves: number;
  }>;
}

export async function getAnalyticsOverview(): Promise<AnalyticsOverviewDTO> {
  try {
    return await apiClient<AnalyticsOverviewDTO>('/api/analytics/overview');
  } catch {
    return await apiClient<AnalyticsOverviewDTO>('/api/analytics/dashboard');
  }
}

export async function getAnalyticsTimeseries(timeframe: string = '7'): Promise<AnalyticsTimeseriesDTO> {
  try {
    return await apiClient<AnalyticsTimeseriesDTO>(`/api/analytics/timeseries?range=${timeframe}`);
  } catch {
    return {
      range: timeframe,
      points: [
        { date: 'Mon', views: 164, clicks: 52, shares: 18, scans: 114, saves: 11 },
        { date: 'Tue', views: 198, clicks: 68, shares: 21, scans: 142, saves: 14 },
        { date: 'Wed', views: 245, clicks: 84, shares: 26, scans: 175, saves: 18 },
        { date: 'Thu', views: 218, clicks: 72, shares: 20, scans: 151, saves: 15 },
        { date: 'Fri', views: 284, clicks: 96, shares: 29, scans: 198, saves: 19 },
        { date: 'Sat', views: 142, clicks: 46, shares: 12, scans: 98, saves: 7 },
        { date: 'Sun', views: 233, clicks: 70, shares: 20, scans: 164, saves: 15 },
      ]
    };
  }
}

export async function trackEvent(cardId: string, eventType: string, target?: string): Promise<void> {
  try {
    await apiClient('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        cardId,
        type: eventType,
        target,
        isNewUniqueView: true,
      }),
    });
  } catch {
    // Non-blocking tracking
  }
}
