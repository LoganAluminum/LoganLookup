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

  async getUserPhoto(userId: string): Promise<string | null> {
    try {
      const response = await fetch(
        `http://localhost:5220/api/User/${userId}/photo`,
        {
          method: 'GET',
        }
      );
  
      if (!response.ok) {
        if (response.status === 404) {
          console.log('User does not have a profile photo.');
          return null;
        }
        console.error(
          `HTTP error fetching user photo! status: ${response.status}`
        );
        return null;
      }
  
      const blob = await response.blob();
      if (blob.size === 0) {
        console.log('User does not have a profile photo.');
        return null;
      }
  
      // Return a blob URL instead
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error fetching or processing user photo:', error);
      return null;
    }
  }
  
}