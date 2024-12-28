import { Routes } from '@angular/router';
import { SearchComponent } from './search/search.component';
import { GroupDetailsComponent } from './group-details/group-details.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { LayoutComponent } from './layout/layout.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: SearchComponent },
      { path: 'group/:groupId', component: GroupDetailsComponent },
      { path: 'user/:userId', component: UserDetailsComponent },
    ],
  },
];