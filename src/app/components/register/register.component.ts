import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { finalize, Subscription, timer } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  loading = false;
  error = '';
  success = '';
  showPassword = false;
  private authSubscription?: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)
      ]],
      username: ['', [
        Validators.required,
        Validators.minLength(4),
        Validators.pattern(/^[a-zA-Z0-9._-]+$/)
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/)
      ]],
      name: ['', [
        Validators.required,
        Validators.minLength(2)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2)
      ]]
    });
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/dashboard']);
    }
    this.registerForm.reset();
    this.error = '';
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.loading = true;
      this.error = '';
      this.success = '';
      
      this.authSubscription = this.authService.register(this.registerForm.value).subscribe({
        next: () => {
          this.success = 'Cuenta creada correctamente';
          this.loading = false; // Asegúrate de detener el estado de carga
          timer(3000).subscribe(() => {
            this.router.navigate(['/login']);
          });
        },
        error: (error) => {
          switch (error.status) {
    
            case 400:
              this.error = 'Datos de registro inválidos';
              break;
            case 403:
              this.error = 'El email o nombre de usuario ya está registrado';
              break;
            default:
              
              this.loading = false;
              timer(3000).subscribe(() => {
                this.router.navigate([' /login']);
              });
          }
          this.loading = false;
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  get emailControl() { return this.registerForm.get('email'); }
  get usernameControl() { return this.registerForm.get('username'); }
  get passwordControl() { return this.registerForm.get('password'); }
  get nameControl() { return this.registerForm.get('name'); }
  get lastNameControl() { return this.registerForm.get('lastName'); }
}