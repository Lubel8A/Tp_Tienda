import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { DescuentoService } from 'src/app/services/descuento.service';

declare var iziToast:any;
declare var $:any;

@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css']
})
export class IndexDescuentoComponent implements OnInit{


  public load_data=true;
  public filtro = '';
  public token;
  public descuentos : Array<any>=[];
  public url;
  public page = 1;
  public pageSize = 15;

  public load_btn=false;

  constructor(
    private _descuentoService : DescuentoService
  ){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data(){
    this._descuentoService.listar_descuentos_admin(this.filtro,this.token).subscribe(
      response=>{
        this.descuentos = response.data;
        this.descuentos.forEach(element =>{
          var tt_inicio = Date.parse(element.fecha_inicio+"T00:00:00")/1000;
          var tt_fin = Date.parse(element.fecha_fin+"T00:00:00")/1000;
          var today = Date.parse(new Date().toString())/1000;
          if (today >= tt_inicio) {
            element.estado = 'Expirado';
          }
          if (today < tt_inicio) {
            element.estado = 'Próximamente';
          }
          if (today >= tt_inicio && today <= tt_fin) {
            element.estado = 'En Progreso';
          }
        });
        this.load_data=false;
      },error=>{
        console.log(error);
      }
    );
  }

  filtrar(){
    if (this.filtro) {
      if (this.filtro) {
        this._descuentoService.listar_descuentos_admin(this.filtro, this.token).subscribe(
          response =>{
            this.descuentos = response.data;
            this.load_data = false;
          },
          error => {
          }
        );
      }
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FFA500',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Ingrese un nombre para buscar por filtro'
      });
    }
  }

  resetear(){
    this.filtro='';
    this.init_Data();
  }

  eliminar(id:any){
    this.load_btn=true;
    this._descuentoService.eliminar_descuento_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'ÉXITO',
          titleColor: '#FFD700',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el descuento.'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.load_btn=false;
        this.init_Data();
      },error=>{
        iziToast.show({
          title: 'ÉXITO',
          titleColor: '#FFD700',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: 'Ocurrió un error en el servidor.'
        });
        console.log(error);
        this.load_btn=false;
      }
    )
  }

}
