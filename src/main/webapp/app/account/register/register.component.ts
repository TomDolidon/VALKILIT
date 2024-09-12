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
import { catchError, switchMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

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

      const { login, email } = this.registerForm.getRawValue();

      // Create account.
      this.registerService
        .save({ login, email, password, langKey: this.translateService.currentLang })
        .pipe(
          // Log in the user.
          switchMap(() => this.loginService.login({ username: login, password, rememberMe: false })),

          // Fetch user identity to get the account.
          switchMap(() => this.accountService.identity(true)),

          // Check if the account is valid.
          switchMap((account: Account | null) => {
            if (!account) {
              this.error.set(true);
              return of(null);
            }

            // Set firstname and lastname.
            account.firstName = firstName;
            account.lastName = lastName;

            // Update the account.
            return this.accountService.save(account).pipe(
              // Create address.
              switchMap(() => this.addressService.create(newAddress)),

              // Create client entity with address and user references.
              switchMap((res: any) => {
                const addressId: IAddress = res.body;
                return this.clientService
                  .create({
                    id: null,
                    internalUser: { id: account.id! },
                    address: addressId,
                  })
                  .pipe(
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    tap(() => this.router.navigate(['/'])),
                  );
              }),

              // Address and client creation errors.
              catchError(error => {
                this.error.set(error);
                return of(null);
              }),
            );
          }),

          // Login and account errors.
          catchError(error => {
            this.processError(error);
            return of(null);
          }),
        )
        .subscribe();
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
