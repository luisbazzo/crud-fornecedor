import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Supplier } from '../fornecedor';
import { FornecedorService } from '../fornecedor.service';

@Component({
  selector: 'app-crud',
  templateUrl: './crud.component.html',
  styleUrls: ['./crud.component.css']
})
export class CrudComponent implements OnInit{
  
  Suppliers : Supplier[] = [];
  formGroupSupplier : FormGroup;
  isEditing : boolean = false;

  constructor(private SuppliersService : FornecedorService,
              private formBuilder : FormBuilder
              ){
    this.formGroupSupplier = formBuilder.group({
      id : [],
      name : [''],
      active : [],
      category : [''],
      contact : ['']
    });
  }

  ngOnInit(): void {
    this.loadSuppliers();
  }

  loadSuppliers(){
    this.SuppliersService.getSuppliers().subscribe(
      {
        next : data => this.Suppliers = data,
        error : () => console.log("Erro ao chamar o endpoint")
      }
    );
  }

  save(){
    if(this.isEditing){
      this.SuppliersService.update(this.formGroupSupplier.value).subscribe(
        {
          next : () => {
            this.loadSuppliers();
            this.formGroupSupplier.reset();
            this.isEditing = false;
          }
        }
      );
    }
    else{
      this.SuppliersService.save(this.formGroupSupplier.value).subscribe(
        {
          next : data => {
            this.Suppliers.push(data);
            this.formGroupSupplier.reset();
          }
        }
      );
    }
  }

  edit(supplier : Supplier){
    this.formGroupSupplier.setValue(supplier);
    this.isEditing = true;
  }

  delete(supplier : Supplier): void{
    this.SuppliersService.remove(supplier).subscribe({
      next: () => this.loadSuppliers()
    });
  }

  active(supplier : boolean){
    if(supplier){
      return "Sim";
    }
    else{
      return "Não";
    }
  }
}
