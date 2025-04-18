import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RowComponent,ColComponent,TextColorDirective,CardComponent,CardHeaderComponent,CardBodyComponent,FormControlDirective,FormDirective,FormLabelDirective,FormSelectDirective,FormCheckComponent,FormCheckInputDirective,FormCheckLabelDirective,ButtonDirective,ColDirective,InputGroupComponent,InputGroupTextDirective} from '@coreui/angular';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {provideNativeDateAdapter} from '@angular/material/core';

interface Faculty {
  name: string;
  carreras: string[];
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  providers: [provideNativeDateAdapter()],
  styleUrls: ['./usuarios.component.scss'],
  imports: [MatDatepickerModule,MatInputModule,MatFormFieldModule ,CommonModule,HttpClientModule,RowComponent,ColComponent,TextColorDirective,CardComponent,CardHeaderComponent,CardBodyComponent,FormControlDirective,ReactiveFormsModule,FormsModule,FormDirective,FormLabelDirective,FormSelectDirective,FormCheckComponent,FormCheckInputDirective,FormCheckLabelDirective,ButtonDirective,ColDirective,InputGroupComponent,InputGroupTextDirective],
  standalone: true})
  
export class UsuariosComponent implements OnInit {
  myForm!: FormGroup;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  facultades: any[] = []; // Cambiado a any[] para evitar errores de tipo
  carreras: any[] = []; // Carreras disponibles
  filteredCarreras: any[] = []; // Carreras filtradas según la facultad seleccionada

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // Se incluye también el campo "area" en el formulario
    this.myForm = this.fb.group({
      tipo: ['', Validators.required],
      idUsuUni: ['', Validators.required],
      cedula: ['', Validators.required],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      facultadId: [''],
      carrera: [''],
      fechaNacimiento: ['', Validators.required],
      especialidad: [''], // Sin validadores, es opcional
      area: [''],         // Sin validadores, es opcional
      passwordHash: ['', Validators.required],
      activo: [true], // Valor predeterminado como booleano
    });
  }

  ngOnInit(): void {
    this.loadFacultades();
    this.loadCarreras();
  }

  registrar(): void {
    console.log(this.myForm.value);
    if (this.myForm.valid) {
      const usuario = this.myForm.value;
      this.http.post('http://localhost:8080/api/usuarios', usuario).subscribe(
        (response) => {
          console.log('Usuario creado exitosamente:', response);
          this.toastType = 'success';
          this.toastMessage = 'Usuario registrado exitosamente!';
          this.showToast = true;

          this.myForm.reset({
            tipo: '', // Valor inicial para tipo
            idUsuUni: '', // Valor inicial para idUsuUni
            cedula: '', // Valor inicial para cedula
            nombre: '', // Valor inicial para nombre
            email: '', // Valor inicial para email
            facultadId: '', // Valor inicial para facultadId
            carrera: '', // Valor inicial para carrera
            fechaNacimiento: '', // Valor inicial para fechaNacimiento
            especialidad: '', // Valor inicial para especialidad
            area: '', // Valor inicial para area
            passwordHash: '', // Valor inicial para passwordHash
            activo: true // Valor inicial para activo
          });

          setTimeout(() => this.showToast = false, 3000);
        },
        (error) => {
          console.error('Error al crear usuario:', error.error);
          this.toastType = 'error'; // Asegurarse de que el tipo de toast sea error
            this.toastMessage = error.error;
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

  loadFacultades(): void {
    this.http.get<any[]>('http://localhost:8080/api/facultades').subscribe(
      (data) => {
        this.facultades = data;

      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  loadCarreras(): void {
    this.http.get<any[]>('http://localhost:8080/api/carreras').subscribe(
      (data) => {
        this.carreras = data;
      },
      (error) => {
        console.error('Error al cargar las carreras:', error);
      }
    );
  }

  onFacultadChange(event: Event): void {
    const selectedFacultadId = (event.target as HTMLSelectElement).value;
  
    console.log('Facultad seleccionada:', selectedFacultadId); // Verifica el ID de la facultad seleccionada
    // Filtrar las carreras según la facultad seleccionada
    this.filteredCarreras = this.carreras.filter(carrera => carrera.facultadId === parseInt(selectedFacultadId, 10));
  
    console.log('Carreras filtradas:', this.filteredCarreras); // Verifica las carreras filtradas
  }
}
