// login.component.ts
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { environment } from '../../../environments/environment.development';


// Es necesario habilitar API ReCaptCHA en google cloud
//https://console.cloud.google.com/marketplace/product/google/recaptchaenterprise.googleapis.com?q=search&referrer=search&project=copaguia-53f7f


// Clave API: AIzaSyAexR8t55jJ519Hrlo0JzLyqtigZ58_oIE

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private auth = getAuth();
  
  phoneForm: FormGroup;
  verificationForm: FormGroup;
  showVerification = false;
  isLoading = false;
  errorMessage = '';
  private recaptchaVerifier?: RecaptchaVerifier;
  private confirmationResult: any;

  constructor() {
        
    // Solo inicializa si no está ya inicializado
    if (!getAuth().app) {
      initializeApp(environment.firebaseConfig);
    }

    this.phoneForm = this.fb.group({
      phone: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{10}$')
      ]]
    });

    this.verificationForm = this.fb.group({
      code: ['', [
        Validators.required, 
        Validators.pattern('^[0-9]{6}$')
      ]]
    });
  }

  ngOnInit() {
    this.setupRecaptcha();
  }

  ngOnDestroy() {
    if (this.recaptchaVerifier) {
      this.recaptchaVerifier.clear();
    }
  }

  private setupRecaptcha() {
    this.recaptchaVerifier = new RecaptchaVerifier(this.auth, 'recaptcha-container', {
      size: 'normal',
      callback: () => {
        // El reCAPTCHA se completó exitosamente
      },
      'expired-callback': () => {
        this.errorMessage = 'El reCAPTCHA ha expirado. Por favor, inténtalo de nuevo.';
      }
    });
  }

  async onSubmitPhone() {
    if (this.phoneForm.valid && this.recaptchaVerifier) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const phoneNumber = '+52' + this.phoneForm.get('phone')?.value;
        this.confirmationResult = await signInWithPhoneNumber(
          this.auth, 
          phoneNumber, 
          this.recaptchaVerifier
        );
        
        this.showVerification = true;
      } catch (error: any) {
        this.handleAuthError(error);
        // Refrescar el reCAPTCHA en caso de error
        this.recaptchaVerifier.clear();
        this.setupRecaptcha();
      } finally {
        this.isLoading = false;
      }
    }
  }

  async onSubmitCode() {
    if (this.verificationForm.valid && this.confirmationResult) {
      this.isLoading = true;
      this.errorMessage = '';
      
      try {
        const code = this.verificationForm.get('code')?.value;
        await this.confirmationResult.confirm(code);
        
        // Navega a la página principal después del login exitoso
        this.router.navigate(['/home']);
      } catch (error: any) {
        this.handleAuthError(error);
      } finally {
        this.isLoading = false;
      }
    }
  }

  private handleAuthError(error: any) {
    switch (error.code) {
      case 'auth/invalid-phone-number':
        this.errorMessage = 'Número de teléfono inválido';
        break;
      case 'auth/code-expired':
        this.errorMessage = 'El código ha expirado. Por favor, solicita uno nuevo';
        this.showVerification = false;
        break;
      case 'auth/invalid-verification-code':
        this.errorMessage = 'Código inválido. Por favor, verifica e intenta de nuevo';
        break;
      case 'auth/too-many-requests':
        this.errorMessage = 'Demasiados intentos. Por favor, intenta más tarde';
        break;
      default:
        this.errorMessage = 'Ocurrió un error. Por favor, intenta de nuevo';
        console.error('Error de autenticación:', error);
    }
  }
}