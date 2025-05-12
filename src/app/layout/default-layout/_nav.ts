import { INavData } from '@coreui/angular';
import { CustomNavData } from './CustomNavData'; // Asegúrate de importar la interfaz correcta

export const navItems: CustomNavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Theme'
  },


  {
    name: 'Colors',
    url: '/theme/colors',
    iconComponent: { name: 'cil-drop' }
  },
  {
    name: 'Typography',
    url: '/theme/typography',
    linkProps: { fragment: 'headings' },
    iconComponent: { name: 'cil-pencil' }
  },
  {
    name: 'Components',
    title: true
  },
  {
    name: 'Base',
    url: '/base',
    iconComponent: { name: 'cil-puzzle' },
    children: [
      {
        name: 'Accordion',
        url: '/base/accordion',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Breadcrumbs',
        url: '/base/breadcrumbs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Cards',
        url: '/base/cards',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Carousel',
        url: '/base/carousel',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Collapse',
        url: '/base/collapse',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'List Group',
        url: '/base/list-group',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Navs & Tabs',
        url: '/base/navs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Pagination',
        url: '/base/pagination',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Placeholder',
        url: '/base/placeholder',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Popovers',
        url: '/base/popovers',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Progress',
        url: '/base/progress',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Spinners',
        url: '/base/spinners',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tables',
        url: '/base/tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tabs',
        url: '/base/tabs',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Tooltips',
        url: '/base/tooltips',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Buttons',
    url: '/buttons',
    iconComponent: { name: 'cil-cursor' },
    children: [
      {
        name: 'Buttons',
        url: '/buttons/buttons',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Button groups',
        url: '/buttons/button-groups',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Dropdowns',
        url: '/buttons/dropdowns',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Forms',
    url: '/forms',
    iconComponent: { name: 'cil-notes' },
    allowedFor: ['Admin'],
    children: [
      {
        name: 'Usuarios',
        url: '/forms/usuarios-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Facultades',
        url: '/forms/facultades-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Carreras',
        url: '/forms/carreras-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Materias',
        url: '/forms/materias-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Materias por Carrera',
        url: '/forms/carreras_materias-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Cursos',
        url: '/forms/cursos-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Inscripciones',
        url: '/forms/inscripciones-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Secciones',
        url: '/forms/secciones',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Asistencias',
        url: '/forms/asistencias-form',
        icon: 'nav-icon-bullet'
      }
      
    ]
  },
  
  {
    name: 'Tables',
    url: '/tables',
    iconComponent: { name: 'cil-align-center' },
    allowedFor: ['Admin'],
    children: [
      {
        name: 'Usuarios',
        url: '/tables/usu-tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Facultades',
        url: '/tables/facu-tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Carreras',
        url: '/tables/carreras-tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Materias',
        url: '/tables/materias-tables',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    title: true,
    name: 'Alumnos'
  },
  {
    name: 'Inscripciones ',
    url: '/alumnos',
    iconComponent: { name: 'cil-education' },
    allowedFor: ['Alumno'], 
    children: [
      {
        name: 'Catálogo de cursos disponibles',
        url: '/alumnos/inscripciones-form',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Mis inscripciones',
        url: '/alumnos/misinscripciones',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  
  {
    name: 'Horario De Clases',
    url: '/sss',
    iconComponent: { name: 'cil-clock' },
    allowedFor: ['Alumno'], 
    children: [
      {
        name: 'Ver mi horario semanal',
        url: '/tables/usu-tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Detalles de sesión',
        url: '/tables/facu-tables',
        icon: 'nav-icon-bullet'
      }
    ]
  },

  {
    name: 'Asistencias',
    url: '/sss',
    iconComponent: { name: 'cil-address-book' },
    allowedFor: ['Alumno'], 
    children: [
      {
        name: 'Registro de asistencias',
        url: '/tables/usu-tables',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Historial de asistencia',
        url: '/tables/facu-tables',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Charts',
    iconComponent: { name: 'cil-chart-pie' },
    url: '/charts'
  },

  {
    name: 'Icons',
    iconComponent: { name: 'cil-star' },
    url: '/icons',
    children: [
      {
        name: 'CoreUI Free',
        url: '/icons/coreui-icons',
        icon: 'nav-icon-bullet',
        badge: {
          color: 'success',
          text: 'FREE'
        }
      },
      {
        name: 'CoreUI Flags',
        url: '/icons/flags',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'CoreUI Brands',
        url: '/icons/brands',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Notifications',
    url: '/notifications',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Alerts',
        url: '/notifications/alerts',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Badges',
        url: '/notifications/badges',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Modal',
        url: '/notifications/modal',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Toast',
        url: '/notifications/toasts',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  {
    name: 'Widgets',
    url: '/widgets',
    iconComponent: { name: 'cil-calculator' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    title: true,
    name: 'Extras'
  },
  {
    name: 'Pages',
    url: '/login',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'Login',
        url: '/login',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Register',
        url: '/register',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 404',
        url: '/404',
        icon: 'nav-icon-bullet'
      },
      {
        name: 'Error 500',
        url: '/500',
        icon: 'nav-icon-bullet'
      }
    ]
  },
  
  
  {
    title: true,
    name: 'Links',
    class: 'mt-auto'
  },
  {
    name: 'Docs',
    url: 'https://coreui.io/angular/docs/',
    iconComponent: { name: 'cil-description' },
    attributes: { target: '_blank' }
  }
];
