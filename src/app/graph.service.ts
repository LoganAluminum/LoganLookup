import { Inject, Injectable } from '@angular/core';
import { AlertsService } from './alerts.service';
import { User } from '@microsoft/microsoft-graph-types';
import { InteractionRequiredAuthError, InteractionType } from '@azure/msal-browser';
import {
  MsalService,
  MSAL_INTERCEPTOR_CONFIG,
  MsalInterceptorConfiguration,
} from '@azure/msal-angular';
import { Client } from '@microsoft/microsoft-graph-client';
import { OAuthSettings } from '../oauth';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  private graphClient: Client;
  public user: User | null = null;

  constructor(
    @Inject(MSAL_INTERCEPTOR_CONFIG)
    private msalInterceptorConfig: MsalInterceptorConfiguration,
    private msalService: MsalService,
    private alertsService: AlertsService
  ) {
    // Initialize the Graph client
    this.graphClient = Client.init({
      authProvider: async (done) => {
        // Get the token from the auth service
        let token = await this.getAccessToken().catch((reason) => {
          done(reason, null);
        });

        if (token) {
          done(null, token);
        } else {
          done('Could not get an access token', null);
        }
      },
    });
  }

  async getAccessToken(): Promise<string | null> {
    try {
      const activeAccount = this.msalService.instance.getActiveAccount();
      if (!activeAccount) {
        console.warn('No active account found.');
        return null;
      }

      const msalResponse = await this.msalService.instance.acquireTokenSilent({
        ...this.msalInterceptorConfig.authRequest,
        scopes: OAuthSettings.scopes,
        account: activeAccount,
      });

      return msalResponse.accessToken;
    } catch (error) {
      console.error('Error acquiring access token:', error);
      if (error instanceof InteractionRequiredAuthError) {
        if (this.msalInterceptorConfig.interactionType === InteractionType.Popup) {
          return this.msalService.instance
            .acquireTokenPopup({
              ...this.msalInterceptorConfig.authRequest,
              scopes: OAuthSettings.scopes, // Scopes added here
              redirectUri: '/auth-end',
            })
            .then((result) => {
              console.log('Popup token:', result);
              return result.accessToken;
            })
            .catch((popupError) => {
              console.error('Popup error:', popupError);
              return null;
            });
        } else {
          return this.msalService.instance
            .acquireTokenRedirect({
              ...this.msalInterceptorConfig.authRequest,
              scopes: OAuthSettings.scopes, // Scopes added here
              redirectUri: '/auth-end',
            })
            .then(() => {
              console.log('Redirect initiated');
              return null; // For redirect, no token is returned in the response
            })
            .catch((redirectError) => {
              console.error('Redirect error:', redirectError);
              return null;
            });
        }
      } else {
        console.error('Non-interactive error:', error);
        return null;
      }
    }
  }

  async searchEntra(searchTerm: string): Promise<any[]> {
    try {
      const usersResponse = await this.graphClient
        .api('/users')
        .filter(
          `startsWith(displayName, '${searchTerm}') or startswith(userPrincipalName, '${searchTerm}') or startswith(mail, '${searchTerm}')`
        )
        .select('id,displayName,userPrincipalName,mail')
        .top(10)
        .get();

      const groupsResponse = await this.graphClient
        .api('/groups')
        .filter(
          `startsWith(displayName, '${searchTerm}') or startswith(mail, '${searchTerm}')`
        )
        .select('id,displayName,mail')
        .top(10)
        .get();

      // Combine and return the results
      const combinedResults = [...usersResponse.value, ...groupsResponse.value];
      return combinedResults;
    } catch (error) {
      console.error('Error searching Entra:', error);
      this.alertsService.add('Error searching Entra', (error as Error).message);
      throw error;
    }
  }
}