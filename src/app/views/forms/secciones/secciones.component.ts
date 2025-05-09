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
  TableDirective
} from '@coreui/angular';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'app-secciones',
  templateUrl: './secciones.component.html',
  styleUrls: ['./secciones.component.scss'],
  providers: [provideNativeDateAdapter()],
  imports: [
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

export class SeccionesComponent implements OnInit {
  myForm!: FormGroup;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  usuarios: any[] = []; // Cambiado a any[] para evitar errores de tipo
  alumnos: any[] = []; // Cambiado a any[] para evitar errores de tipo
  cursos: any[] = []; // Cambiado a any[] para evitar errores de tipo
  materias: any[] = []; // Cambiado a any[] para evitar errores de tipo


  selectedFaculty: string = '';
  selectedCarrera: string = '';
  selectedTipoUsuario: string = '';
  searchTerm: string = '';
  filteredUsers: any[] = []; // Cambiado a any[] para evitar errores de tipo
  filteredCarreras: any[] = []; // Cambiado a any[] para evitar errores de tipo
  facultades: any[] = []; // Cambiado a any[] para evitar errores de tipo
  carreras: any[] = []; // Cambiado a any[] para evitar errores de tipo
  selectedUser: any = null; // Cambiado a any para evitar errores de tipo
  carrerasMaterias: any[] = []; // Cambiado a any[] para evitar errores de tipo
  selecteCurso: any = null; // Cambiado a any para evitar errores de tipo
  searchCursoTerm: string = '';
  filteredCursos: any[] = []; // Cambiado a any[] para evitar errores de tipo

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // Se incluye también el campo "area" en el formulario
    this.myForm = this.fb.group({
      cursoPk: ['', Validators.required],
      dia_semana: ['', Validators.required],
      horaInicio: ['', Validators.required],
      horaFin: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    Promise.all([this.loadFacultades(), this.loadCarreras(), this.loadMaterias(), this.loadCarrerasMaterias(),this.loadUsuarios()]).then(() => {
      this.loadAlumnos(); // Si necesitas cargar alumnos por separado
      this.loadCursos(); // Cargar cursos después de que materias y carrerasMaterias estén disponibles
    });
  }

  registrar(): void {
    if (this.myForm.valid) {
      const formData = { ...this.myForm.value };
  
      console.log('Datos enviados:', formData);
  
      this.http.post('http://localhost:8080/api/sesiones', formData).subscribe(
        (response) => {
          console.log('Sección registrada exitosamente:', response);
          this.myForm.reset();
        },
        (error) => {
          console.error('Error al registrar la sección:', error);
        }
      );
    }
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

  loadAlumnos(): void {
    this.http.get<any[]>('http://localhost:8080/api/usuarios/alumno').subscribe(
      (data) => {
        this.alumnos = data.map(user => {
          // Convertir los valores a números para la comparación
          const carrera = this.carreras.find(c => +c.carreraPk === +user.carrera);
          user.carreraNombre = carrera ? carrera.nombre : 'Carrera no encontrada';

          const facultad = this.facultades.find(f => +f.facultadId === +user.facultadId);
          user.facultadNombre = facultad ? facultad.nombre : 'Facultad no encontrada';

          return user;
        });

        console.log('Alumnos:', this.alumnos); // Verifica los datos de los alumnos

        this.applyFilters(); // Inicializar la lista filtrada
      },
      (error) => {
        console.error('Error al cargar los materias:', error);
      }
    );
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

        this.applyFilters(); // Inicializar la lista filtrada
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

          console.log('CarrerasMaterias cargadas:', this.carrerasMaterias);
          resolve();
        },
        (error) => {
          console.error('Error al cargar la relación carrera-materia:', error);
          reject(error);
        }
      );
    });
  }

  private isLoadingCursos = false;

  loadCursos(): void {
    this.http.get<any[]>('http://localhost:8080/api/cursos').subscribe(
      (data) => {
        console.log('Cursos:', data); // Verifica los datos de los cursos
          this.cursos = data.map(curso => {
            const materia = this.materias.find(m => m.materiaPk === curso.materiaPk);
            const profesor = this.usuarios.find(u => u.idUsuUni === curso.profesorId);


            return {
              ...curso,
              materiaNombre: materia ? materia.nombre : 'Sin Materia',
              materiaDescripcion: materia ? materia.descripcion : 'Sin Descripción',
              profesorNombre: profesor ? profesor.nombre : 'Sin Profesor'
            };
          });

        this.isLoadingCursos = false;
        this.filteredCursos = this.cursos; // Mostrar todos los cursos al inicio
      },
      (error) => {
        console.error('Error al cargar los cursos:', error);
        this.isLoadingCursos = false;
      }
    );
  }

  onFacultyChange(): void {
    // Buscar la facultad seleccionada
    const selectedFaculty = this.facultades.find(f => f.facultadId === +this.selectedFaculty);

    // Filtrar las carreras según la facultad seleccionada
    this.filteredCarreras = selectedFaculty
      ? this.carreras.filter(c => c.facultadId === selectedFaculty.facultadId)
      : [];

    // Limpiar el filtro de carrera si la facultad cambia
    this.selectedCarrera = '';

    // Aplicar los filtros
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredUsers = this.alumnos.filter(user => {
      // Filtrar por facultad
      const matchesFaculty = this.selectedFaculty
        ? user.facultadId === +this.selectedFaculty
        : true;

      // Filtrar por carrera
      const matchesCarrera = this.selectedCarrera
        ? user.carrera === this.selectedCarrera
        : true;

      // Filtrar por tipo de usuario
      const matchesTipoUsuario = this.selectedTipoUsuario
        ? user.tipo === this.selectedTipoUsuario
        : true;

      // Filtrar por término de búsqueda
      const matchesSearchTerm = this.searchTerm
        ? user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.idUsuUni.toString().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;

      // Retornar true si el usuario cumple con todos los filtros
      return matchesFaculty && matchesCarrera && matchesTipoUsuario && matchesSearchTerm;
    });
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  trackByFn(index: number, item: any): any {
    return item.idUsuUni; // o cualquier propiedad única del usuario
  }

  getColorForUser(user: any): string {
    const colors = ['#FF5733', '#33FF57', '#3357FF', '#FF33A1', '#A133FF', '#33FFF5', '#F5FF33'];
    const index = user.idUsuUni % colors.length; // Usa el ID para asignar un color
    return colors[index];
  }

  getInitials(name: string): string {
    return name ? name.charAt(0).toUpperCase() : '?'; // Obtiene la primera letra del nombre
  }

  onFacultadChange(event: Event): void {
    const selectedFacultadId = (event.target as HTMLSelectElement).value;

    console.log('Facultad seleccionada:', selectedFacultadId); // Verifica el ID de la facultad seleccionada
    // Filtrar las carreras según la facultad seleccionada
    this.filteredCarreras = this.carreras.filter(carrera => carrera.facultadId === parseInt(selectedFacultadId, 10));

    console.log('Carreras filtradas:', this.filteredCarreras); // Verifica las carreras filtradas
  }

  filterCursos(): void {
    const term = this.searchCursoTerm.toLowerCase();
    this.filteredCursos = this.cursos.filter(curso =>
      curso.materiaNombre.toLowerCase().includes(term) || // Buscar por nombre
      curso.cursoPk.toString().includes(term) // Buscar por código
    );
  }

  SelectUsuario(user: any): void {
    this.selectedUser = user;
    console.log('Usuario seleccionado:', this.selectedUser);

    // Asegurarse de que todos los datos estén cargados antes de llamar a loadCursos
    Promise.all([
      this.loadCarrerasMaterias(),
      this.loadMaterias(),
      this.loadUsuarios()
    ]).then(() => {
      this.loadCursos();
    });
    // Actualizar el valor del formulario reactivo
    this.myForm.patchValue({
      alumnoId: user.idUsuUni // Asegúrate de usar el identificador correcto
    });
  }

  SelectCurso(curso: any): void {
    this.selecteCurso = curso; // Mantén el objeto completo para mostrar el nombre en el span
    console.log('Curso seleccionado:', this.selecteCurso);

    // Actualizar el valor del formulario reactivo con el identificador del curso
    this.myForm.patchValue({
      cursoPk: curso.cursoPk // Solo el identificador del curso
    });
  }

  onTimeChange(event: any, controlName: string): void {
    console.log("asdas")
    console.log(event)
    console.log(`Evento recibido para ${controlName}:`, event);
  
    if (!event || !event.value) {
      console.error(`Valor inválido para ${controlName}:`, event);
      return;
    }
  
    const date = new Date(event.value);
  
    // Verificar si el objeto Date es válido
    if (isNaN(date.getTime())) {
      console.error(`Fecha inválida para ${controlName}:`, event.value);
      return;
    }
  
    // Extraer la hora en formato HH:mm:ss
    const hours = date.getUTCHours().toString().padStart(2, '0'); // Asegura que tenga 2 dígitos
    const minutes = date.getUTCMinutes().toString().padStart(2, '0'); // Asegura que tenga 2 dígitos
    const seconds = '00'; // Agrega segundos como "00"
    const time = `${hours}:${minutes}:${seconds}`; // Formato HH:mm:ss
  
    console.log(`Hora formateada para ${controlName}:`, time);
  
    // Actualizar el valor en el formulario
    this.myForm.patchValue({ [controlName]: time });
  }

}
