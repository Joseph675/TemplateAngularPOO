import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Tables'
    },
    children: [
      {
        path: '',
        redirectTo: 'tables',
        pathMatch: 'full'
      },
      {
        path: 'usu-tables',
        loadComponent: () => import('./usu-tables/usu-tables.component').then(m => m.UsuTablesComponent),
        data: {
          title: 'Tables'
        }
      }
    ]
  }
];

