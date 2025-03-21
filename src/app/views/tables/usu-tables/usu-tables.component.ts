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
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe(
      (data) => {
        this.users = data;
        this.applyFilters();
      },
      (error) => {
        console.error('Error al cargar los usuarios:', error);
      }
    );
  }

  onFacultyChange(): void {
    const selectedFaculty = this.faculties.find(f => f.name === this.selectedFaculty);
    this.filteredCarreras = selectedFaculty ? selectedFaculty.carreras : [];
    this.applyFilters();
  }


  applyFilters(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesFaculty = this.selectedFaculty ? user.facultad === this.selectedFaculty : true;
      const matchesCarrera = this.selectedCarrera ? user.carrera === this.selectedCarrera : true;
      const matchesTipoUsuario = this.selectedTipoUsuario ? user.tipoUsuario === this.selectedTipoUsuario : true;
      const matchesSearchTerm = this.searchTerm ? 
        user.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        user.idUsuUni.toString().includes(this.searchTerm) ||
        user.email.toLowerCase().includes(this.searchTerm.toLowerCase()) : true;
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
