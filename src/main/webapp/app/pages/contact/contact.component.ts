import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common'; // Importer CommonModule

@Component({
  selector: 'jhi-contact',
  standalone: true,
  imports: [Button, ReactiveFormsModule, CommonModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.scss',
})
export default class ContactComponent {
  contactForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private router: Router,
  ) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      this.messageService.add({
        severity: 'success',
        summary: 'Formulaire envoyé',
        detail: 'Nous en prendrons connaissance le plus rapidement possible',
      });
      this.router.navigate(['/']);
    }
  }
}
