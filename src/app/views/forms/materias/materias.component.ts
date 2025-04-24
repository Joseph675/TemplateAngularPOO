import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective } from '@coreui/angular';

interface Faculty {
  name: string;
  carreras: string[];
}

@Component({
  selector: 'app-materias',
  templateUrl: './materias.component.html',
  styleUrls: ['./materias.component.scss'],
  imports: [CommonModule, HttpClientModule, RowComponent, ColComponent, TextColorDirective, CardComponent, CardHeaderComponent, CardBodyComponent, FormControlDirective, ReactiveFormsModule, FormsModule, FormDirective, FormLabelDirective, FormSelectDirective, FormCheckComponent, FormCheckInputDirective, FormCheckLabelDirective, ButtonDirective, ColDirective, InputGroupComponent, InputGroupTextDirective],
  standalone: true
})

export class MateriasComponent implements OnInit {
  myForm!: FormGroup;
  showToast: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  time? = new Date();

  users: any[] = [];
  carreras: any[] = [];

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
    this.loadUsers();
    this.loadCarreras();
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


  loadUsers(): void {
    this.http.get<any[]>('http://localhost:8080/api/usuarios').subscribe(
      (data) => {
        // Filtrar solo los usuarios cuyo tipo sea "Profesor"
        this.users = data.filter(user => user.tipo === 'Profesor');
        console.log('Usuarios cargados (solo Profesores):', this.users);
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

}
