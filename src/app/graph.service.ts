import { Injectable } from '@angular/core';
import { AlertsService } from './alerts.service';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  constructor(private alertsService: AlertsService) {}

  async searchEntra(searchTerm: string): Promise<any[]> {
    try {
      const response = await fetch(
        `http://localhost:5220/api/search?searchTerm=${encodeURIComponent(
          searchTerm
        )}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const results = await response.json();
      return results;
    } catch (error) {
      console.error('Error searching Entra:', error);
      this.alertsService.add(
        'Error searching Entra',
        (error as Error).message
      );
      throw error;
    }
  }

  async getUserDetails(userId: string): Promise<any> {
    const response = await fetch(`http://localhost:5220/api/User/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getUserGroups(userId: string): Promise<any[]> {
    const response = await fetch(
      `http://localhost:5220/api/User/${userId}/groups`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  async getGroupMembers(groupId: string): Promise<any[]> {
    const response = await fetch(
      `http://localhost:5220/api/Group/${groupId}/members`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }

  // graph.service.ts
async getGroupDetails(groupId: string): Promise<any> {
  const response = await fetch(`http://localhost:5220/api/Group/${groupId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return await response.json();
}
}