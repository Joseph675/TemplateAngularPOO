import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective, ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
  CardImgDirective,
  CardTextDirective,
  CardTitleDirective,
  TableModule,
  ProgressComponent,
  AvatarComponent,
  TableDirective,
  TemplateIdDirective,
  WidgetStatFComponent,
  Tabs2Module 
} from '@coreui/angular';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatIcon  } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';
import { AuthService } from '../../../services/auth.service';

import { cilArrowRight, cilChartPie, cilUser, cilAddressBook,cilHome } from '@coreui/icons';
import { IconDirective  } from '@coreui/icons-angular';

@Component({
  selector: 'app-mis_inscripciones',
  templateUrl: './mis_inscripciones.component.html',
  styleUrls: ['./mis_inscripciones.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [
    Tabs2Module,
    TemplateIdDirective,
    WidgetStatFComponent,
    IconDirective,
    TableDirective,
    ProgressComponent,
    AvatarComponent,
    TableModule,
    CardImgDirective,
    CardTextDirective,
    CardTitleDirective,
    ModalBodyComponent,
    ModalComponent,
    ModalFooterComponent,
    ModalHeaderComponent,
    ModalTitleDirective,
    ModalToggleDirective, MatInputModule, MatIcon, MatTimepickerModule, MatFormFieldModule, CommonModule, HttpClientModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective],
  standalone: true
})

export class MisInscripcionesComponent implements OnInit {
  myForm!: FormGroup;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  cilHome = cilHome;

  handleChange($event: string | number | undefined) {
    console.log('handleChange', $event);
  }

  usuarios: any[] = []; // Cambiado a any[] para evitar errores de tipo
  alumnos: any[] = []; // Cambiado a any[] para evitar errores de tipo
  cursos: any[] = []; // Cambiado a any[] para evitar errores de tipo
  materias: any[] = []; // Cambiado a any[] para evitar errores de tipo

  user: any = null;
  userName: string = '';
  useridUsuUni: string = '';
  userFacultad: string = '';
  userCarrera: string = '';
  userCarreraNUM: string = '';
  inscripciones: any[] = []; // Cambiado a any[] para evitar errores de tipo

  selectedFaculty: string = '';
  selectedCarrera: string = '';
  selectedTipoUsuario: string = '';
  searchTerm: string = '';
  filteredUsers: any[] = []; // Cambiado a any[] para evitar errores de tipo
  filteredCarreras: any[] = []; // Cambiado a any[] para evitar errores de tipo
  facultades: any[] = []; // Cambiado a any[] para evitar errores de tipo
  carreras: any[] = []; // Cambiado a any[] para evitar errores de tipo
  carrerasMaterias: any[] = []; // Cambiado a any[] para evitar errores de tipo
  selecteCurso: any = null; // Cambiado a any para evitar errores de tipo
  searchCursoTerm: string = '';
  filteredCursos: any[] = []; // Cambiado a any[] para evitar errores de tipo


  icons = { cilChartPie, cilArrowRight, cilUser, cilAddressBook };


  constructor(private http: HttpClient, private fb: FormBuilder, private authService: AuthService) {

  }

  ngOnInit(): void {
    Promise.all([this.loadFacultades(), this.loadCarreras(), this.loadMaterias(), this.loadCarrerasMaterias(),this.loadCursos(), this.loadUsuarios()]).then(() => {
      this.loadInscripciones(); // Cargar inscripciones al inicio
    });

    const user = this.authService.getUser(); // Recuperar el usuario desde localStorage
    this.userName = user.nombre || 'Usuario';
    this.useridUsuUni = user.idUsuUni || 'Usuario no encontrado';

    this.userFacultad = user.facultadId || 'Facultad no encontrada';
    this.userCarrera = user.carrera || 'Carrera no encontrada';
    this.userCarreraNUM = user.carrera || 'Carrera no encontrada';

    this.loadFacultades().then(() => {
      const facultad = this.facultades.find(f => f.facultadId === this.userFacultad);
      this.userFacultad = facultad ? facultad.nombre : 'Facultad no encontrada';
    });

    this.loadCarreras().then(() => {
      const carrera = this.carreras.find(c => +c.carreraPk === +this.userCarrera); // Convertir ambos a número
      this.userCarrera = carrera ? carrera.nombre : 'Carrera no encontrada';
    });

    this.myForm = this.fb.group({
      cursoPk: ['', Validators.required],
      alumnoId: [this.useridUsuUni, Validators.required],
      estado: ['Activo', Validators.required]
    });

  }

  


  loadMaterias(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>('http://localhost:8080/api/materias').subscribe(
        (data) => {
          this.materias = data;
          resolve(); // Resuelve la promesa cuando las materias se cargan correctamente
        },
        (error) => {
          console.error('Error al cargar las materias:', error);
          reject(error); // Rechaza la promesa si ocurre un error
        }
      );
    });
  }

  loadFacultades(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>('http://localhost:8080/api/facultades').subscribe(
        (data) => {
          this.facultades = data;
          resolve();
        },
        (error) => {
          console.error('Error al cargar las facultades:', error);
          reject(error);
        }
      );
    });
  }

  loadCarreras(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>('http://localhost:8080/api/carreras').subscribe(
        (data) => {
          this.carreras = data;
          resolve();
        },
        (error) => {
          console.error('Error al cargar las carreras:', error);
          reject(error);
        }
      );
    });
  }

  loadUsuarios(): void {
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe(
      (data) => {

        this.usuarios = data.map(user => {
          // Convertir los valores a números para la comparación
          const carrera = this.carreras.find(c => +c.carreraPk === +user.carrera);
          user.carreraNombre = carrera ? carrera.nombre : 'Carrera no encontrada';

          const facultad = this.facultades.find(f => +f.facultadId === +user.facultadId);
          user.facultadNombre = facultad ? facultad.nombre : 'Facultad no encontrada';

          return user;
        });

      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }


  loadCarrerasMaterias(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.get<any[]>('http://localhost:8080/api/carrera_materia').subscribe(
        (data) => {
          this.carrerasMaterias = data.map(cm => ({
            carreraPk: cm.id.carreraPk,
            materiaPk: cm.id.materiaPk,
            anioCursada: cm.anioCursada,
            cuatrimestre: cm.cuatrimestre
          }));

          resolve();
        },
        (error) => {
          console.error('Error al cargar la relación carrera-materia:', error);
          reject(error);
        }
      );
    });
  }

  loadCursos(): void {

    this.http.get<any[]>('http://localhost:8080/api/cursos').subscribe(
      (data) => {

        console.log('Cursos disponibles:', data);
        this.cursos = data.filter(curso => {
          const carreraMateria = this.carrerasMaterias.find(cm => cm.materiaPk === curso.materiaPk);


          if (!carreraMateria) {
            console.warn(`No se encontró relación en carrerasMaterias para materiaPk: ${curso.materiaPk}`);
          } else if (carreraMateria.carreraPk !== +this.userCarreraNUM) { // Convertir a número
            console.warn(`La carrera del usuario (${this.userCarreraNUM}) no coincide con la carrera de la materia (${carreraMateria.carreraPk})`);
          }

          return carreraMateria && carreraMateria.carreraPk === +this.userCarreraNUM; // Convertir a número
        });


        if (this.cursos.length === 0) {
          console.warn('El filtro no devolvió ningún curso');
        } else {
          this.cursos = this.cursos.map(curso => {
            const materia = this.materias.find(m => m.materiaPk === curso.materiaPk);
            const profesor = this.usuarios.find(u => u.idUsuUni === curso.profesorId);


            return {
              ...curso,
              materiaNombre: materia ? materia.nombre : 'Sin Materia',
              materiaDescripcion: materia ? materia.descripcion : 'Sin Descripción',
              profesorNombre: profesor ? profesor.nombre : 'Sin Profesor'
            };
          });
        }

        this.filteredCursos = this.cursos; // Mostrar todos los cursos al inicio
        console.log('Cursos filtrados:', this.cursos);
      },
      (error) => {
        console.error('Error al cargar los cursos:', error);
      }
    );
  }

  loadInscripciones(): void {
    this.http.get<any[]>('http://localhost:8080/api/inscripciones').subscribe(
      (data) => {

        // Filtrar las inscripciones para que solo se incluyan las del usuario actual
        const inscripcionesFiltradas = data.filter(inscri => +inscri.alumnoId === +this.useridUsuUni);

        // Procesar las inscripciones filtradas
        this.inscripciones = inscripcionesFiltradas.map(inscri => {
          // Buscar el alumno correspondiente
          const alumno = this.usuarios.find(u => +u.idUsuUni === +inscri.alumnoId);
          const alumnoNombre = alumno ? alumno.nombre : 'Alumno no encontrado';


          // Buscar el curso correspondiente
          const curso = this.filteredCursos.find(c => c.cursoPk === inscri.cursoPk);
          console.log('Curso encontrado:', this.filteredCursos);

          const cursoNombre = curso ? curso.materiaNombre : 'Curso no encontrado';
          const cursoDescripcion = curso ? curso.materiaDescripcion : 'Sin descripción';
          const cursoSemestre = curso ? curso.cuatrimestre : 'Sin cuatrimestre';


          // Combinar los datos
          return {
            ...inscri,
            alumnoNombre,
            cursoNombre,
            cursoDescripcion,
            cursoSemestre
          };
        });

        console.log('Inscripciones con datos relacionados:', this.inscripciones);
      },
      (error) => {
        console.error('Error al cargar las inscripciones:', error);
      }
    );
  }


  
}
