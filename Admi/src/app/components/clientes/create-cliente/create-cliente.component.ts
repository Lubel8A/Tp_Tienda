import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

declare var iziToast:any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css']
})
export class CreateClienteComponent implements OnInit{

  public cliente : any = {
    genero: ''
  };

  public token;
  public load_btn=false;

  constructor(
    private _clienteService:ClienteService,
    private _adminService:AdminService,
    private _router:Router
  ){
    this.token = this._adminService.getToken();
  }
  
  ngOnInit():void{
  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      console.log(this.cliente);
      this.load_btn = true;
      const data = this.cliente;
      this._clienteService.registro_cliente_admin(this.token, data).subscribe(
        response => {
          if (response.data === undefined) {
            iziToast.show({
              title: 'ERROR',
              titleColor: '#FFA500',
              theme: 'dark',
              class: 'text-danger',
              position: 'topRight',
              message: response.message
            });
            this.load_btn = false;
          } else {
            console.log(response);
            iziToast.show({
              title: 'ÉXITO',
              titleColor: '#FFD700',
              theme: 'dark',
              class: 'text-success',
              position: 'topRight',
              message: 'Se registró correctamente el nuevo cliente.'
            });
            this.cliente = {
              genero: '',
              nombres: '',
              apellidos: '',
              f_nacimiento: '',
              telefono: '',
              dni: '',
              email: '',
              clave: ''
            };
            this.load_btn = false;
            this._router.navigate(['/panel/clientes']);
          }
          console.log(response);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FFA500',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Falta completar datos del formulario'
      });
    }
  }
}