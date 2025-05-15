import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RowComponent,ColComponent,TextColorDirective,CardComponent,CardHeaderComponent,CardBodyComponent,FormControlDirective,FormDirective,FormLabelDirective,FormSelectDirective,FormCheckComponent,FormCheckInputDirective,FormCheckLabelDirective,ButtonDirective,ColDirective,InputGroupComponent,InputGroupTextDirective,ProgressComponent } from '@coreui/angular';

interface Faculty {
  name: string;
  carreras: string[];
}

@Component({
  selector: 'app-registrarasistenciasprofe.component',
  templateUrl: './registrarasistenciasprofe.component.component.html',
  styleUrls: ['./registrarasistenciasprofe.component.component.scss'],
  imports: [ ProgressComponent, CommonModule,HttpClientModule,RowComponent,ColComponent,TextColorDirective,CardComponent,CardHeaderComponent,CardBodyComponent,FormControlDirective,ReactiveFormsModule,FormsModule,FormDirective,FormLabelDirective,FormSelectDirective,FormCheckComponent,FormCheckInputDirective,FormCheckLabelDirective,ButtonDirective,ColDirective,InputGroupComponent,InputGroupTextDirective],
  standalone: true})
  
export class VerAsistenciasAlumnoComponent implements OnInit {
  myForm!: FormGroup;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  faculties: Faculty[] = [
    {
      name: 'Facultad de Ingeniería',
      carreras: [
        'Ingeniería de Sistemas',
        'Ingeniería Civil',
        'Ingeniería Industrial',
        'Ingeniería Electrónica',
        'Ingeniería Mecánica'
      ]
    },
    {
      name: 'Facultad de Derecho',
      carreras: [
        'Derecho',
        'Ciencias Políticas y Relaciones Internacionales'
      ]
    },
    {
      name: 'Facultad de Ciencias de la Salud',
      carreras: [
        'Medicina',
        'Enfermería',
        'Odontología',
        'Medicina Veterinaria'
      ]
    },
    {
      name: 'Facultad de Ciencias Económicas y Administrativas',
      carreras: [
        'Administración de Empresas',
        'Contaduría Pública',
        'Economía',
        'Finanzas',
        'Mercadeo'
      ]
    },
    {
      name: 'Facultad de Ciencias de la Educación y Humanidades',
      carreras: [
        'Pedagogía',
        'Psicología',
        'Trabajo Social',
        'Comunicación Social',
        'Historia'
      ]
    }
  ];

  filteredCarreras: string[] = [];

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // Se incluye también el campo "area" en el formulario
    this.myForm = this.fb.group({
      idUsuUni: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      facultad: ['', Validators.required],
      tipoUsuario: ['ESTUDIANTE', Validators.required],
      carrera: ['', Validators.required],
      especialidad: [''],
      area: [''],  
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    // Inicializa la facultad con la primera opción y carreras filtradas
    if (this.faculties.length > 0) {
      this.myForm.get('facultad')?.setValue(this.faculties[0].name);
      this.filteredCarreras = this.faculties[0].carreras;
    }

    // Suscribirse a los cambios en el control "tipoUsuario"
    this.myForm.get('tipoUsuario')?.valueChanges.subscribe(value => {
      // Primero, se habilitan todos los controles que se van a manipular
      this.myForm.get('carrera')?.enable();
      this.myForm.get('especialidad')?.enable();
      this.myForm.get('area')?.enable();

      switch (value) {
        case 'ESTUDIANTE':
          // Si es estudiante, deshabilita "especialidad" y "area"
          this.myForm.get('especialidad')?.disable();
          this.myForm.get('area')?.disable();
          break;
        case 'PROFESOR':
          // Si es profesor, deshabilita "carrera" y "area"
          this.myForm.get('carrera')?.disable();
          this.myForm.get('area')?.disable();
          break;
        case 'ADMINISTRADOR':
          // Si es administrativo, deshabilita "carrera" y "especialidad"
          this.myForm.get('carrera')?.disable();
          this.myForm.get('especialidad')?.disable();
          break;
        default:
          // Si el valor no es reconocido, no se deshabilita ninguno
          break;
      }
    });
    // Ejecutar la suscripción inicialmente para aplicar el estado con el valor por defecto.
    this.myForm.get('tipoUsuario')?.updateValueAndValidity();
  }

  onFacultyChange(event: any): void {
    const selectedFaculty = event.target.value;
    const faculty = this.faculties.find(f => f.name === selectedFaculty);
    if (faculty) {
      this.filteredCarreras = faculty.carreras;
      this.myForm.get('carrera')?.setValue('');
    } else {
      this.filteredCarreras = [];
    }
  }

  registrar(): void {
    console.log(this.myForm);
    if (this.myForm.valid) {
      const usuario = this.myForm.value;
      this.http.post('http://localhost:8080/api/usuarios', usuario).subscribe(
        (response) => {
          console.log('Usuario creado exitosamente:', response);
          this.toastType = 'success';
          this.toastMessage = 'Usuario registrado exitosamente!';
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
        },
        (error) => {
          console.error('Error al crear usuario:', error);
          this.toastType = 'error'; // Asegurarse de que el tipo de toast sea error
          if (error.status === 409) {
            this.toastMessage = 'El usuario ya existe!';
          } else {
            this.toastMessage = 'Error al registrar el usuario!';
          }
          this.showToast = true;
          setTimeout(() => this.showToast = false, 3000);
        }
      );
    } else {
      console.error('El formulario no es válido');
      this.toastType = 'error';
      this.toastMessage = 'El formulario no es válido!';
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    }
  }
}
