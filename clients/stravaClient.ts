import { StravaActivity, StravaAthlete } from "../plans/plan.ts";


export class StravaClient {
  private baseUrl = "https://www.strava.com/api/v3";
  private accessToken: string;

  constructor(accessToken: string) {
    this.accessToken = accessToken;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers = {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
      ...options.headers
    };

    const response = await fetch(url, { ...options, headers });

    if (!response.ok) {
      throw new Error(`Strava API error: ${response.status}`);
    }

    return response.json();
  }


  getActivities(): Promise<StravaActivity[]> {
    return this.request<StravaActivity[]>('/athlete/activities');
  }

  getActivity(activityId: string): Promise<StravaActivity> {
    return this.request<StravaActivity>(`/activities/${activityId}`);
  }

  getActivitiesByUserId(userId: string): Promise<StravaActivity[]> {
    return this.request<StravaActivity[]>(`/athletes/${userId}/activities`);
  }

  getAthlete(userId: string): Promise<StravaAthlete> {
    return this.request<StravaAthlete>(`/athlete`);
  }
}