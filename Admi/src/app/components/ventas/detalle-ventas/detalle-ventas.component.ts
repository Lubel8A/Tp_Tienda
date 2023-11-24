import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';

@Component({
  selector: 'app-detalle-ventas',
  templateUrl: './detalle-ventas.component.html',
  styleUrls: ['./detalle-ventas.component.css']
})
export class DetalleVentasComponent implements OnInit{

  public url;
  public token;
  public orden: any={};
  public detalles: Array<any>=[];
  public load_data = true;
  public id:any;
  public totalstar= 5;
  public review: any ={};

  constructor(
    private _adminService: AdminService,
    private _route: ActivatedRoute
  ){
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this.init_data();
      }
    )
  }

  ngOnInit(): void {
    
  }

  init_data(){
    this._adminService.obtener_detalles_ordenes_cliente(this.id, this.token).subscribe(
      response=>{
        console.log(response)
        if (response.data != undefined) {
          this.orden = response.data;

          this.detalles = response.detalles;
          this.load_data = false;
        }else{
          this.orden = undefined;
        }
        console.log(this.detalles)
      }
    );
  }

}
