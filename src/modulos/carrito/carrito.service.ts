import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrito } from './entities/carrito.entity';
import { ProductoService } from '../productos/productos.service';
import { CreateCarritoDto } from './dto/create-carrito.dto';
import { UpdateCarritoDto } from './dto/update-carrito.dto';
import { CarritoProducto } from '../carrito-producto/entities/carrito-producto.entity'; // Asegúrate de que la ruta sea correcta

@Injectable()
export class CarritoService {
  constructor(
    @InjectRepository(Carrito)
    private carritoRepository: Repository<Carrito>,
    private productoService: ProductoService,
  ) {}

  async create(createCarritoDto: CreateCarritoDto): Promise<Carrito> {
    const carrito = this.carritoRepository.create(createCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async findAll(): Promise<Carrito[]> {
    return this.carritoRepository.find();
  }

  async findOne(id: number): Promise<Carrito> {
    const carrito = await this.carritoRepository.findOne({
      where: { id_carrito: id },
      relations: ['carritoProductos', 'carritoProductos.producto'],
    });
    if (!carrito) {
      throw new NotFoundException(`Carrito con ID ${id} no encontrado`);
    }
    return carrito;
  }

  async update(id: number, updateCarritoDto: UpdateCarritoDto): Promise<Carrito> {
    const carrito = await this.findOne(id);
    this.carritoRepository.merge(carrito, updateCarritoDto);
    return this.carritoRepository.save(carrito);
  }

  async remove(id: number): Promise<void> {
    const carrito = await this.findOne(id);
    await this.carritoRepository.remove(carrito);
  }

  async agregarProducto(idCarrito: number, idProducto: number, cantidad: number): Promise<Carrito> {
    const carrito = await this.findOne(idCarrito);
    const producto = await this.productoService.findOne(idProducto);

    if (!producto) {
      throw new NotFoundException(`Producto con ID ${idProducto} no encontrado`);
    }

    if (producto.stock < cantidad) {
      throw new BadRequestException(`Stock insuficiente para el producto con ID ${idProducto}`);
    }

    const carritoProducto = new CarritoProducto();
    carritoProducto.carrito = carrito;
    carritoProducto.producto = producto;
    carritoProducto.cantidad = cantidad;

    if (!carrito.carritoProductos) {
      carrito.carritoProductos = [];
    }

    carrito.carritoProductos.push(carritoProducto);
    await this.carritoRepository.save(carrito);

    return this.findOne(idCarrito);
  }

  async eliminarProducto(idCarrito: number, idProducto: number): Promise<Carrito> {
    const carrito = await this.findOne(idCarrito);

    if (!carrito.carritoProductos) {
      return carrito;
    }

    carrito.carritoProductos = carrito.carritoProductos.filter(
      (cp) => cp.producto.id_producto !== idProducto,
    );
    await this.carritoRepository.save(carrito);

    return this.findOne(idCarrito);
  }

  async listarProductos(idCarrito: number): Promise<{ producto: any; cantidad: number; subtotal: number }[]> {
    const carrito = await this.findOne(idCarrito);

    if (!carrito.carritoProductos) {
      return [];
    }

    return Promise.all(
      carrito.carritoProductos.map(async (cp) => {
        const producto = await this.productoService.findOne(cp.producto.id_producto);
        const cantidad = cp.cantidad;
        const subtotal = producto.precio * cantidad;
        return { producto, cantidad, subtotal };
      }),
    );
  }

  async actualizarCantidad(idCarrito: number, idProducto: number, cantidad: number): Promise<Carrito> {
    const carrito = await this.findOne(idCarrito);

    if (!carrito.carritoProductos) {
      return carrito;
    }

    const carritoProducto = carrito.carritoProductos.find(
      (cp) => cp.producto.id_producto === idProducto,
    );
    if (carritoProducto) {
      carritoProducto.cantidad = cantidad;
      await this.carritoRepository.save(carrito);
    }

    return this.findOne(idCarrito);
  }
}