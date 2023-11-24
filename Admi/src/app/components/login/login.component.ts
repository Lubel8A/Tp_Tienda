import { Token } from '@angular/compiler';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm} from '@angular/forms';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var jQuery : any;
declare var $ : any;
declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  @ViewChild('passwordInput') passwordInput!: ElementRef;
  public user : any = {};
  public usuario : any = {};
  public token : any = '';

  constructor(
    private _adminService: AdminService,
    private _router : Router
  )
  {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    
    if (this.token){
      this._router.navigate(['/']);
    }
    else {

    }
  }

  togglePassword() {
    const passwordInput = this.passwordInput.nativeElement; // Si usas ViewChild

    // Obtén el estado del checkbox
    const checkbox = document.querySelector('.custom-control-input') as HTMLInputElement;

    // Cambia el tipo de input dependiendo del estado del checkbox
    if (checkbox.checked) {
      passwordInput.type = 'text'; // Si el checkbox está seleccionado, muestra la contraseña
    } else {
      passwordInput.type = 'password'; // Si no, oculta la contraseña
    }
  }

  login(loginForm: NgForm){
    if(loginForm.valid)
    {
      console.log (this.user);

      let data = {
        email : this.user.email,
        password : this.user.password
      }

      this._adminService.login_admin(data).subscribe(
        response => {
          if (response.data == undefined){
            iziToast.show({
              title: 'Error',
              titleColor: '#FF0000',
              color: 'FFF',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
            });
          }
          else {
            this.usuario = response.data;

            localStorage.setItem('token',response.token);
            localStorage.setItem('_id',response.data._id);

            this._router.navigate(['/']);

          }
        },
        error => {
          console.log(error);
        }
      );
    }

    else {
      iziToast.show({
        title: 'Error',
        titleColor: '#FF0000',
        color: 'FFF',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
    }

  }

}