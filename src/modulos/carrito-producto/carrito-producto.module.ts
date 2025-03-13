import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoProducto } from './entities/carrito-producto.entity';
import { CarritoProductoController } from './carrito-producto.controller';
import { CarritoProductoService } from './carrito-producto.service';

@Module({
  imports: [TypeOrmModule.forFeature([CarritoProducto])],
  controllers: [CarritoProductoController],
  providers: [CarritoProductoService],
  exports: [CarritoProductoService],
})
export class CarritoProductosModule  {}