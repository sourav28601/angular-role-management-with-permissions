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
import { AssignRoleComponent } from '../admin/user/assign-role/assign-role.component';
import { ListAssignRoleComponent } from '../admin/user/list-assign-role/list-assign-role.component';
import { EditAssignRoleComponent } from '../admin/user/edit-assign-role/edit-assign-role.component';
import { AuthGuard } from 'src/app/core/guards/auth/auth.guard';
import { OuterGuard } from 'src/app/core/guards/outer/outer.guard';
import { PostReviewComponent } from '../admin/post-review/post-review/post-review.component';
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
        canActivate:[AuthGuard],
        component: CreateRoleComponent,
      },
      {
        path: 'role-list',
        canActivate:[AuthGuard],
        component: RoleListComponent,
      },
      { path: 'edit-role/:id',
        canActivate:[AuthGuard],
        component: EditRoleComponent,
      },
      { path: 'assign-role',
        canActivate:[AuthGuard],
        component: AssignRoleComponent,
      },
      { path: 'user-list',
        canActivate:[AuthGuard],
        component: ListAssignRoleComponent,
      },
      { path: 'edit-user/:id',
        canActivate:[AuthGuard],
        component: EditAssignRoleComponent,
      },
      {
        path:'post-review',
        canActivate:[AuthGuard],
        component: PostReviewComponent,
      },
      {
        path: 'tables',
        component: AppTablesComponent,
      },
    ],
  },
];
