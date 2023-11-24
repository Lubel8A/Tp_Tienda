import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(
    private _router : Router
  ){

  }

  logout() {
    localStorage.removeItem('token'); // Elimina el token almacenado
    this._router.navigate(['/login']);
  }
}
