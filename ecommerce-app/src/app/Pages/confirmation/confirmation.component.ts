import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { OrderData } from '../../Models/orderdata';



@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit{
 order: OrderData | null = null;

  constructor(private router: Router) {}
  


  ngOnInit(): void{
    const orderDataStr = localStorage.getItem('orderData');
    if (orderDataStr) {
      this.order = JSON.parse(orderDataStr);
    }else{
      this.router.navigate(['/products']);
    }
  }

formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-MX',{
    year: 'numeric',
    month: 'long',
    day: 'numeric'

  });

}
}//end
