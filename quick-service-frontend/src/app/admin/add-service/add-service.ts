import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ServiceService } from '../../services/service.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  templateUrl: './add-service.html'
})
export class AddServiceComponent {
  name = '';
  price = '';

  constructor(private service: ServiceService) {}

  add() {
    this.service.addService({
  name: this.name,   // ✅ name
  price: this.price
}).subscribe(() => {
      alert('Service Added ✅');
      this.name = '';
      this.price = '';
    });
  }
}