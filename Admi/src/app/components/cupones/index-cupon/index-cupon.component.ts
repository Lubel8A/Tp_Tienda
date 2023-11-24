import { Component, OnInit } from '@angular/core';
import { CuponService } from 'src/app/services/cupon.service';

declare var iziToast:any;
declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css']
})
export class IndexCuponComponent implements OnInit{

  public load_data=true;
  public page = 1;
  public pageSize = 10;
  public cupones :Array<any>=[];
  public filtro = '';
  public token;

  constructor(
    private _cuponService: CuponService
  ){
    this.token = localStorage.getItem('token');
  }

  init_Data(){
    this._cuponService.listar_cupones_admin(this.filtro,this.token).subscribe(
      response=>{
        this.cupones=response.data;
        this.load_data=false;
      }
    )
  }

  ngOnInit(): void {
    this.init_Data();
  }

  filtrar(){
    this.init_Data();
  }

  eliminar(id:any){
    this._cuponService.eliminar_cupon_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'ÉXITO',
          titleColor: '#FFD700',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el cliente.'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.init_Data();
      },error=>{
        console.log(error);
      }
    )
  }
}
