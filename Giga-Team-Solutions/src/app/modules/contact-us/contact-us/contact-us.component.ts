import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ApiService } from '../../../services/api.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrl: './contact-us.component.scss'
})
export class ContactUsComponent {
  constructor(private apiService: ApiService) { }
  onSubmit(form: NgForm) {
    if (form.valid) {
      // Access the form values
      const formData = form.value;
      console.log('Form Data:', formData);

      // Example: Sending data to a server or further processing
      // this.myService.sendMessage(formData).subscribe(response => {
      //   console.log('Message sent successfully');
      // });
    } else {
      console.log('Form is invalid');
    }
  }

  onSubmits(form: NgForm) {
    if (form.valid) {
      const formData = {
        name: form.value.name,
        email: form.value.email,
        message: form.value.message
      };

      this.apiService.sendEmail(formData).subscribe((response: any) => {
        console.log('Email sent successfully', response);
        form.reset();
      }, (error: any) => {
        console.error('Error sending email', error);
      });
    }
  }
}
