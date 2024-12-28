# Entra ID Search Application - Frontend Overview

This application provides a user interface for searching users and groups within Entra ID. It leverages Angular for the frontend framework and communicates with a backend ASP.NET Core API to fetch data from the Microsoft Graph API. (PLACEHOLDER LINK FOR BACKEND API)

## Overview

The frontend application is built using Angular and is designed to be a single-page application (SPA). It allows users to:

1.  **Search for Users and Groups:** Users can enter a search term in a search box, and the application will display a list of matching users and groups in real-time.
2.  **View User Details:** Clicking on a user's name in the search results will navigate to a dedicated user details page. This page displays more information about the user and a list of groups they belong to.
3.  **View Group Details:** Clicking on a group's name (either in the search results or on a user's detail page) will navigate to a dedicated group details page. This page displays the group's information and a list of its members.

## Components

The application consists of the following main components:

### `AppComponent`

*   **Selector:** `app-root`
*   **Purpose:** The root component of the application. It primarily acts as a container for other components and holds the `<router-outlet>`, where routed components are rendered.

### `SearchComponent`

*   **Selector:** `app-search`
*   **Route:** `/`
*   **Purpose:** Handles the main search functionality.
    *   Provides a search box where users can enter their search terms.
    *   Fetches search results from the backend API using the `GraphService`.
    *   Displays a list of search results (users and groups).
    *   Allows navigation to `UserDetailsComponent` or `GroupDetailsComponent` when a user or group is clicked.
    *   Updates the URL with the search query using query parameters.

### `UserDetailsComponent`

*   **Selector:** `app-user-details`
*   **Route:** `/user/:userId`
*   **Purpose:** Displays detailed information about a specific user.
    *   Fetches user details from the backend API based on the `userId` route parameter.
    *   Displays properties like `displayName`, `userPrincipalName`, `mail`, `jobTitle`, `department`, and `officeLocation`.
    *   Fetches and displays a list of groups the user is a member of.
    *   Provides clickable links to the `GroupDetailsComponent` for each group the user belongs to.

### `GroupDetailsComponent`

*   **Selector:** `app-group-details`
*   **Route:** `/group/:groupId`
*   **Purpose:** Displays detailed information about a specific group.
    *   Fetches group details from the backend API based on the `groupId` route parameter.
    *   Fetches and displays a list of the group's members.

## Routing

The application uses Angular's `RouterModule` to handle client-side routing. The routes are defined in the `app.routes.ts` file:

*   **`/`:** Renders the `SearchComponent`, which is the main search page.
*   **`/user/:userId`:** Renders the `UserDetailsComponent`, displaying details for the user with the specified `userId`.
*   **`/group/:groupId`:** Renders the `GroupDetailsComponent`, displaying details for the group with the specified `groupId`.

The `SearchComponent` uses the `Router` service to navigate to the user and group detail routes when a search result is clicked. The `UserDetailsComponent` and `GroupDetailsComponent` use the `ActivatedRoute` service to extract the `userId` and `groupId` parameters from the URL, respectively.

## Services

### `GraphService`

*   **Purpose:** This service handles all communication with the backend API, abstracting away the details of making HTTP requests.
    *   `searchEntra(searchTerm)`: Calls the backend API to perform the search for users and groups.
    *   `getUserDetails(userId)`: Calls the backend API to fetch details for a specific user.
    *   `getUserGroups(userId)`: Calls the backend API to fetch the groups a user belongs to.
    *   `getGroupDetails(groupId)`: Calls the backend API to fetch details for a specific group.
    *   `getGroupMembers(groupId)`: Calls the backend API to fetch the members of a specific group.

## Notes

*   The frontend application relies on a backend API (implemented in ASP.NET Core) to handle authentication with Entra ID using the client credentials flow and to make calls to the Microsoft Graph API.
*   The frontend application itself does not store or handle any sensitive credentials (like the client secret).
*   This application is designed for internal use within an organization and uses application permissions to access data in Entra ID.

# LoganLookup

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.3.11.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.io/cli) page.
