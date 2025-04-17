import { Component, OnInit, ViewChild} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { IconDirective } from '@coreui/icons-angular';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup} from '@angular/forms';
import {
  ButtonDirective,
  CardBodyComponent,
  CardComponent,
  CardHeaderComponent,
  ColComponent,
  RowComponent,
  AvatarComponent,
  ProgressComponent,
  TableModule, 
  ModalBodyComponent,
  ModalComponent,
  ModalFooterComponent,
  ModalHeaderComponent,
  ModalTitleDirective,
  ModalToggleDirective,
} from '@coreui/angular';

interface Faculty {
  name: string;
  carreras: string[];
}

@Component({
  selector: 'app-usu-tables',
  templateUrl: './usu-tables.component.html',
  styleUrls: ['./usu-tables.component.scss'],
  imports: [
    ProgressComponent,
    ButtonDirective,
    CommonModule,
    HttpClientModule,
    FormsModule,
    RowComponent,
    ColComponent,
    CardComponent,
    CardHeaderComponent,
    CardBodyComponent,
    IconDirective,
    RouterLink,
    AvatarComponent,
    ProgressComponent,
    TableModule,
    ReactiveFormsModule,
    ModalComponent, ModalHeaderComponent, ModalTitleDirective, ModalBodyComponent, ModalFooterComponent, ModalToggleDirective
  ],
  standalone: true
})
export class UsuTablesComponent implements OnInit {
  myForm!: FormGroup;

  users: any[] = [];
  selectedUser: any = null;
  filteredUsers: any[] = [];
  facultades: any[] = []; // Cambiado a any[] para evitar errores de tipo
  carreras: any[] = []; // Carreras disponibles
  filteredCarreras: any[] = []; // Carreras filtradas según la facultad seleccionada

  selectedFaculty: string = '';
  selectedCarrera: string = '';
  selectedTipoUsuario: string = '';
  searchTerm: string = '';

  constructor(private http: HttpClient, private fb: FormBuilder) {
    // Se incluye también el campo "area" en el formulario
    this.myForm = this.fb.group({
      idUsuUni: [{ value: '', disabled: true }],
      nombre: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      facultad: [{ value: '', disabled: true }],
      tipoUsuario: ['ESTUDIANTE', Validators.required],
      carrera: [{ value: '', disabled: true }],
      especialidad: [''],
      area: [''],  
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    Promise.all([this.loadFacultades(), this.loadCarreras()]).then(() => {
      this.loadUsers();
    });
  }


  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe(
      (data) => {
        console.log('Usuarios:', data);
        console.log('Carreras:', this.carreras);
        console.log('Facultades:', this.facultades);
  
        this.users = data.map(user => {
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

  onFacultyChange(): void {
    // Actualizar las carreras filtradas según la facultad seleccionada
    const selectedFaculty = this.facultades.find(f => f.name === this.selectedFaculty);
    this.filteredCarreras = selectedFaculty ? selectedFaculty.carreras : [];
  
    // Aplicar los filtros
    this.applyFilters();
  }
  
  
  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      // Filtrar por facultad
      const matchesFaculty = this.selectedFaculty
        ? user.facultadNombre === this.selectedFaculty
        : true;
  
      // Filtrar por carrera
      const matchesCarrera = this.selectedCarrera
        ? user.carreraNombre === this.selectedCarrera
        : true;
  
      // Filtrar por tipo de usuario
      const matchesTipoUsuario = this.selectedTipoUsuario
        ? user.tipoUsuario === this.selectedTipoUsuario
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

  openEditModal(user: any): void {
    this.selectedUser = user;
    this.myForm.patchValue(user);
    console.log('Usuario seleccionado:',  this.selectedUser);
  }
}
