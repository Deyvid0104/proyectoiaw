import { IsString, IsNumber, IsDecimal } from 'class-validator';

export class CreateProductoDto {
  @IsString()
  nombre: string;

  @IsString()
  descripcion: string;

  @IsDecimal()
  precio: number;

  @IsNumber()
  stock: number;

  @IsNumber()
  id_categoria: number;

  @IsString()
  imagen: string;

  @IsString()
  marca: string;

  @IsString()
  modelo: string;
}