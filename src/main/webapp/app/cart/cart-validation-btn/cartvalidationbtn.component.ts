import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AccountService } from 'app/core/auth/account.service';
import { ButtonModule } from 'primeng/button';
import { StateStorageService } from 'app/core/auth/state-storage.service';
import { DialogModule } from 'primeng/dialog';
import { LoginService } from 'app/login/login.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'jhi-cartvalidationbtn',
  standalone: true,
  imports: [ButtonModule, DialogModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cartvalidationbtn.component.html',
  styleUrl: './cartvalidationbtn.component.scss',
  animations: [],
})
export class CartValidationButtonComponent {
  authenticationError = signal(false);
  label = 'Valider le panier';
  account = false;
  visible = false;
  loginForm = new FormGroup({
    username: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    password: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    rememberMe: new FormControl(false, { nonNullable: true, validators: [Validators.required] }),
  });
  private router = inject(Router);
  private accountService = inject(AccountService);
  private stageStorageService = inject(StateStorageService);
  private translate = inject(TranslateService);
  private loginService = inject(LoginService);

  showDialog(): void {
    this.visible = true;
  }
  goToRegister(): void {
    this.stageStorageService.storeUrl('/cart');
    this.router.navigate(['account/register']);
  }
  identify(): void {
    this.loginService.login(this.loginForm.getRawValue()).subscribe({
      next: () => {
        this.authenticationError.set(false);
        if (!this.router.getCurrentNavigation()) {
          // There were no routing during login (eg from navigationToStoredUrl)
          this.router.navigate(['']);
        }
      },
      error: () => this.authenticationError.set(true),
    });
  }
  validate(): void {
    if (this.accountService.isAuthenticated()) {
      // TODO METTRE LA BONE ROUTE ICI ET ENVOYER LE PANIER VERS LA BDD
      this.router.navigate(['/account/settings']);
    } else {
      this.showDialog();
      this.stageStorageService.storeUrl('/cart');
    }
  }
}
