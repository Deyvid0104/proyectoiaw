// src/modulos/carrito/carrito.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarritoService } from './carrito.service';
import { CarritoController } from './carrito.controller';
import { Carrito } from './entities/carrito.entity';
import { CarritoProducto } from '../carrito-producto/entities/carrito-producto.entity';
import { ProductoModule } from '../productos/productos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Carrito, CarritoProducto]),
    ProductoModule,
  ],
  controllers: [CarritoController],
  providers: [CarritoService],
  exports: [CarritoService],
})
export class CarritoModule {}