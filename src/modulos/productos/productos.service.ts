import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Producto } from './entities/productos.entity';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { CategoriaService } from '../categoria/categoria.service';

@Injectable() // Indica que esta clase es un servicio de NestJS
export class ProductoService {
  constructor(
    @InjectRepository(Producto) // Inyecta el repositorio de la entidad Producto
    private productoRepository: Repository<Producto>,
    private categoriaService: CategoriaService, // Inyecta el servicio de la entidad Categoria
  ) {}

  async create(createProductoDto: CreateProductoDto, userRole: string): Promise<Producto> {
    if (userRole !== 'admin') { // Verifica si el usuario tiene el rol de administrador
      throw new UnauthorizedException('Solo los administradores pueden crear productos');
    }
    const categoria = await this.categoriaService.findOne(createProductoDto.id_categoria); // Busca la categoría por su ID
    if (!categoria) {
      throw new NotFoundException(`Categoría con ID ${createProductoDto.id_categoria} no encontrada`);
    }

    const producto = this.productoRepository.create(createProductoDto); // Crea una nueva instancia de la entidad Producto
    producto.categoria = categoria; // Asocia el producto a la categoría encontrada
    return this.productoRepository.save(producto); // Guarda el producto en la base de datos
  }

  async findAll(): Promise<Producto[]> {
    return this.productoRepository.find(); // Obtiene todos los productos de la base de datos
  }

  async findOne(id: number): Promise<Producto> {
    const producto = await this.productoRepository.findOneBy({ id_producto: id }); // Busca un producto por su ID
    if (!producto) {
      throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    }
    return producto;
  }

  async update(id: number, updateProductoDto: UpdateProductoDto, userRole: string): Promise<Producto> {
    if (userRole !== 'admin') { // Verifica si el usuario tiene el rol de administrador
      throw new UnauthorizedException('Solo los administradores pueden actualizar productos');
    }
    const producto = await this.findOne(id); // Busca el producto por su ID

    if (updateProductoDto.id_categoria) { // Verifica si se proporciona un nuevo ID de categoría
      const categoria = await this.categoriaService.findOne(updateProductoDto.id_categoria); // Busca la nueva categoría por su ID
      if (!categoria) {
        throw new NotFoundException(`Categoría con ID ${updateProductoDto.id_categoria} no encontrada`);
      }
      producto.categoria = categoria; // Asocia el producto a la nueva categoría
    }

    this.productoRepository.merge(producto, updateProductoDto); // Actualiza los campos del producto con los datos proporcionados
    return this.productoRepository.save(producto); // Guarda el producto actualizado en la base de datos
  }

  async remove(id: number, userRole: string): Promise<void> {
    if (userRole !== 'admin') { // Verifica si el usuario tiene el rol de administrador
      throw new UnauthorizedException('Solo los administradores pueden eliminar productos');
    }
    const producto = await this.findOne(id); // Busca el producto por su ID
    await this.productoRepository.remove(producto); // Elimina el producto de la base de datos
  }
}