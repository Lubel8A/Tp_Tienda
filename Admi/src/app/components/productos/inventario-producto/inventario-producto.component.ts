import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from "exceljs";
import * as fs from "file-saver";

declare var iziToast:any;
declare var JQuery:any;
declare var $:any;

@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css']
})
export class InventarioProductoComponent implements OnInit {

  public id:any;
  public _iduser;
  public token;
  public producto :any = {};
  public inventarios :Array<any>=[];
  public load_btn=false;
  public inventario : any = {};
  public arr_inventario : Array<any>=[];

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ){
    this.token = localStorage.getItem('token');
    this._iduser = localStorage.getItem('_id');
  }

  init_data(){
    this._productoService.listar_inventario_producto_admin(this.producto._id,this.token).subscribe(
      response=>{
        this.inventarios = response.data;
        this.inventarios.forEach(element =>{
          this.arr_inventario.push({
            admin: element.admin.nombres + ' ' + element.admin.apellidos,
            cantidad: element.cantidad,
            proveedor: element.proveedor
          });
        });
      },error=>{
      }
    );
  }

  ngOnInit(): void{
    this._route.params.subscribe(
      params=>{
        this.id = params['id'];
        this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
          response=>{
            if (response.data == undefined) {
              this.producto = undefined;
            }else{
              this.producto = response.data;

              this.init_data();
            }
          },error=>{
          }
        )
      }
    );
  }

  eliminar(id:any){
    this.load_btn=true;
    this._productoService.eliminar_inventario_producto_admin(id,this.token).subscribe(
      response=>{
        iziToast.show({
          title: 'ÉXITO',
          titleColor: '#FFD700',
          theme: 'dark',
          class: 'text-success',
          position: 'topRight',
          message: 'Se eliminó correctamente el producto.'
        });
        $('#delete-'+id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.load_btn=false;
        this.init_data();
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

  registro_inventario(inventarioForm:any){
    if (inventarioForm.valid) {
      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this._iduser,
        proveedor: inventarioForm.value.proveedor
      };
      console.log(data);
      this._productoService.registro_inventario_producto_admin(data,this.token).subscribe(
        response=>{
          iziToast.show({
            title: 'ÉXITO',
            titleColor: '#FFD700',
            theme: 'dark',
            class: 'text-success',
            position: 'topRight',
            message: 'Se agregó el nuevo stock al producto.'
          });
          this.init_data();
        },error=>{
          console.log(error);
        }
      )
      console.log(this.inventario);
    }else{
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FFA500',
        theme: 'dark',
        class: 'text-danger',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos'
      });
    }
  }

  donwload_excel(){
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet("Reporte de productos");

    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario){
      let x2=Object.keys(x1);

      let temp=[]
      for(let y of x2){
        temp.push(x1[y])
      }
      worksheet.addRow(temp)
    }

    let fname='REP01- ';

    worksheet.columns = [
      { header: 'Trabajador', key: 'col1', width: 30},
      { header: 'Cantidad', key: 'col2', width: 15},
      { header: 'Proveedor', key: 'col3', width: 25},
    ]as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, fname+'-'+new Date().valueOf()+'.xlsx');
    });
  }
}