import { Routes } from '@angular/router';

// ui
import { AppBadgeComponent } from './badge/badge.component';
import { AppChipsComponent } from './chips/chips.component';
import { AppListsComponent } from './lists/lists.component';
import { AppMenuComponent } from './menu/menu.component';
import { AppTooltipsComponent } from './tooltips/tooltips.component';
import { AppFormsComponent } from './forms/forms.component';
import { AppTablesComponent } from './tables/tables.component';
import { CreateRoleComponent } from '../admin/role/create-role/create-role.component';
import { RoleListComponent } from '../admin/role/role-list/role-list.component';
import { EditRoleComponent } from '../admin/role/edit-role/edit-role.component';
export const UiComponentsRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'badge',
        component: AppBadgeComponent,
      },
      {
        path: 'chips',
        component: AppChipsComponent,
      },
      {
        path: 'lists',
        component: AppListsComponent,
      },
      {
        path: 'menu',
        component: AppMenuComponent,
      },
      {
        path: 'tooltips',
        component: AppTooltipsComponent,
      },
      {
        path: 'forms',
        component: AppFormsComponent,
      },
      {
        path: 'create-role',
        component: CreateRoleComponent,
      },
      {
        path: 'role-list',
        component: RoleListComponent,
      },
      { path: 'edit-role/:id',
        component: EditRoleComponent,
      },
      {
        path: 'tables',
        component: AppTablesComponent,
      },
    ],
  },
];
