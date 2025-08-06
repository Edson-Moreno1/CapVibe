import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  cartItemCount: number = 0;

  constructor(private cartService:CartService) { }

  ngOnInit(): void {
    this.cartService.getCart().subscribe(items => { 
      this.cartItemCount = items.reduce((count, item) => count + item.quantity,0);
    });
  }



}//end
