import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { MaterialModule } from './shared/material.module';
import { CommonModule } from '@angular/common';
import { CartService } from './services/cart.service';
import { NotificationsComponent } from './components/notifications/notifications.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, MaterialModule, CommonModule, NotificationsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private cartService = inject(CartService);

  protected title = 'YamiStore IA';
  protected cartItems = this.cartService.itemCount;

  ngOnInit() {
    // Cargar el carrito desde localStorage al inicializar la aplicación
    this.cartService.loadFromStorage();
  }
}
