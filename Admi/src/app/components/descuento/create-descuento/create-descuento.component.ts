import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../../services/admin.service';
import { DescuentoService } from 'src/app/services/descuento.service';
import { Router } from '@angular/router';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-create-descuento',
  templateUrl: './create-descuento.component.html',
  styleUrls: ['./create-descuento.component.css']
})
export class CreateDescuentoComponent implements OnInit {

  public descuento : any={};
  public file:any=undefined;
  public imgSelect:any | ArrayBuffer='assets/img/01.jpg';
  public token;
  public load_btn=false;

  constructor(
    private _adminService : AdminService,
    private _adminDescuento : DescuentoService,
    private _router: Router

  ){
    this.token=this._adminService.getToken();
  }

  ngOnInit(): void {
    
  }

  registro(registroForm:any){
    if (registroForm.valid) {
      if (this.file == undefined) {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FFA500',
          theme: 'dark',
          class: 'text-danger',
          position: 'topRight',
          message: 'Debe subir un banner para registrar el descuento'
        });
      }else{
        if (this.descuento.descuento >= 1 && this.descuento.descuento <= 100) {
          this.load_btn=true;
          this._adminDescuento.registro_descuento_admin(this.descuento,this.file,this.token).subscribe(
            response=>{
              iziToast.show({
                title: 'ÉXITO',
                titleColor: '#FFD700',
                theme: 'dark',
                class: 'text-success',
                position: 'topRight',
                message: 'Se registró correctamente el nuevo descuento.'
              });
              this.load_btn=false;
              this._router.navigate(['/panel/descuentos']);
            },error=>{
              console.log(error);
              this.load_btn=false;
            }
        );
        }else{
          iziToast.show({
            title: 'ERROR',
            titleColor: '#FFA500',
            theme: 'dark',
            class: 'text-danger',
            position: 'topRight',
            message: 'El descuento debe ser entre 0% a 100%'
          });
          this.load_btn=false;
        }
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FFA500',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
      this.load_btn=false;
      $('#input-portada').text('Seleccionar imagen');
        this.imgSelect='assets/img/01.jpg';
        this.file=undefined;
    }
  }

  fileChangeEvent(event:any):void{
    var file;
    if (event.target.files && event.target.files[0]) {
      file=<File>event.target.files[0];
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FFA500',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'No hay una imagen para subir'
      });
    }
    if (file && file.size <= 4000000) {
      if (file.type == 'image/png' || file.type == 'image/webp' || file.type == 'image/jpg' || file.type == 'image/gif' || file.type == 'image/jpeg') {
        const reader = new FileReader();
        reader.onload = e => this.imgSelect = reader.result;
        reader.readAsDataURL(file);
        $('#input-portada').text(file.name);
        this.file = file;
      }else{
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FFA500',
          theme: 'dark',
          class: 'text-danger',
          position: 'topRight',
          message: 'El archivo debe de ser una imagen'
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect='assets/img/01.jpg';
        this.file=undefined;
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FFA500',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB'
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect='assets/img/01.jpg';
      this.file=undefined;
    }
  }

}
