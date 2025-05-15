import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Asistencias',
    },
    children: [
      {
        path: '',
        redirectTo: 'form-control',
        pathMatch: 'full'
      },
      {
        path: 'registrar_asistencia',
        loadComponent: () => import('./registrarasistenciasprofe/registrarasistenciasprofe.component').then(m => m.RegistrarAsistenciasProfeComponent),
        data: {
          title: 'Registrar Asistencia'
        }
      },
      {
        path: 'misasistencias',
        loadComponent: () => import('./verasistenciasalumno/verasistenciasalumno.component').then(m => m.VerAsistenciasAlumnoComponent),
        data: {
          title: 'Mis Asistencias'
        }
      }

    ]
  }
];
