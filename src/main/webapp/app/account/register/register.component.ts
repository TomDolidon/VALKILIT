import { AfterViewInit, Component, ElementRef, inject, signal, viewChild } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { EMAIL_ALREADY_USED_TYPE, LOGIN_ALREADY_USED_TYPE } from 'app/config/error.constants';
import SharedModule from 'app/shared/shared.module';
import PasswordStrengthBarComponent from '../password/password-strength-bar/password-strength-bar.component';
import { RegisterService } from './register.service';
import { AddressService } from '../../entities/address/service/address.service';
import { IAddress, NewAddress } from '../../entities/address/address.model';
import { AccountService } from '../../core/auth/account.service';
import { LoginService } from '../../login/login.service';
import { ClientService } from '../../entities/client/service/client.service';
import { Account } from '../../core/auth/account.model';

@Component({
  standalone: true,
  selector: 'jhi-register',
  imports: [SharedModule, FormsModule, ReactiveFormsModule, PasswordStrengthBarComponent, RouterLink],
  templateUrl: './register.component.html',
})
export default class RegisterComponent implements AfterViewInit {
  login = viewChild.required<ElementRef>('login');

  doNotMatch = signal(false);
  error = signal(false);
  errorEmailExists = signal(false);
  errorUserExists = signal(false);
  success = signal(false);

  registerForm = new FormGroup({
    login: new FormControl('', {
      nonNullable: true,
      validators: [
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z0-9!$&*+=?^_`{|}~.-]+@[a-zA-Z0-9-]+(?:\\.[a-zA-Z0-9-]+)*$|^[_.@A-Za-z0-9-]+$'),
      ],
    }),
    firstName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    lastName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(1), Validators.maxLength(50)],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(5), Validators.maxLength(254), Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    confirmPassword: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.minLength(4), Validators.maxLength(50)],
    }),
    street: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    postalCode: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    city: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    country: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  private translateService = inject(TranslateService);
  private registerService = inject(RegisterService);
  private addressService = inject(AddressService);
  private accountService = inject(AccountService);
  private loginService = inject(LoginService);
  private clientService = inject(ClientService);
  private router = inject(Router);

  ngAfterViewInit(): void {
    this.login().nativeElement.focus();
  }

  register(): void {
    this.doNotMatch.set(false);
    this.error.set(false);
    this.errorEmailExists.set(false);
    this.errorUserExists.set(false);

    const { password, confirmPassword } = this.registerForm.getRawValue();
    if (password !== confirmPassword) {
      this.doNotMatch.set(true);
    } else {
      // Identity and address fields.
      const { firstName, lastName, street, postalCode, city, country } = this.registerForm.getRawValue();
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const newAddress: NewAddress = { street, postalCode, city, country };

      // Create account.
      const { login, email } = this.registerForm.getRawValue();
      this.registerService.save({ login, email, password, langKey: this.translateService.currentLang }).subscribe({
        next: () => {
          // Log-in automatically the user.
          this.loginService.login({ username: login, password, rememberMe: false }).subscribe(() => {
            this.accountService.identity(true).subscribe({
              next: (account: Account | null) => {
                if (account === null) {
                  this.error.set(true);
                  return;
                }

                // Update the account with additional fields.
                account.firstName = firstName;
                account.lastName = lastName;
                this.accountService.save(account).subscribe({
                  next: () => {
                    // Create address entity.
                    this.addressService.create(newAddress).subscribe({
                      next: res => {
                        const addressId: IAddress = res.body!;

                        // Create client entity with the user id and address id.
                        this.clientService
                          .create({
                            id: null,
                            internalUser: { id: account.id! },
                            address: addressId,
                          })
                          .subscribe({
                            next: () => {
                              this.router.navigate(['/']);
                            },
                            error: response => this.error.set(response),
                          });
                      },
                      error: response => this.error.set(response),
                    });
                  },
                  error: response => this.error.set(response),
                });
              },
              error: response => this.error.set(response),
            });
          });
        },
        error: response => this.processError(response),
      });
    }
  }

  private processError(response: HttpErrorResponse): void {
    if (response.status === 400 && response.error.type === LOGIN_ALREADY_USED_TYPE) {
      this.errorUserExists.set(true);
    } else if (response.status === 400 && response.error.type === EMAIL_ALREADY_USED_TYPE) {
      this.errorEmailExists.set(true);
    } else {
      this.error.set(true);
    }
  }
}
