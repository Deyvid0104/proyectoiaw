import { Controller, Get, Post, Body, Put, Param, Delete, Headers, Req , UseGuards } from '@nestjs/common';
import { ProductoService } from './productos.service';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { Request } from 'express';
import { JwtAuthGuard } from 'src/modulos/auth/guard/jwt-auth.guard';
import { RolesGuard } from 'src/modulos/auth/guard/roles.guard';
/*import { RolesGuard } from 'src/modulos/auth/guard/roles.guard';*/

@Controller('productos') // Define el prefijo de la ruta para este controlador
export class ProductoController {
  constructor(private readonly productoService: ProductoService) {} // Inyecta el servicio ProductoService

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
    create(@Body() createProductoDto: CreateProductoDto, @Req() req: Request) {
    const userRole = (req as any).user.rol; // Accede al rol correctamente
   return this.productoService.create(createProductoDto, userRole);
  } 


  @Get() // Define la ruta para obtener todos los productos (GET /productos)
  findAll() {
    return this.productoService.findAll(); // Llama al método findAll del servicio
  }

  @Get(':id') // Define la ruta para obtener un producto por su ID (GET /productos/:id)
  findOne(@Param('id') id: string) { // Obtiene el ID del producto de los parámetros de la ruta
    return this.productoService.findOne(+id); // Llama al método findOne del servicio
  }

  @Put(':id') // Define la ruta para actualizar un producto (PUT /productos/:id)
  update(@Param('id') id: string, @Body() updateProductoDto: UpdateProductoDto, @Headers('user-role') userRole: string) { // Obtiene los datos del cuerpo de la solicitud, el ID del producto y el rol del usuario
    return this.productoService.update(+id, updateProductoDto, userRole); // Llama al método update del servicio
  }

  @Delete(':id') // Define la ruta para eliminar un producto (DELETE /productos/:id)
  remove(@Param('id') id: string, @Headers('user-role') userRole: string) { // Obtiene el ID del producto y el rol del usuario
    return this.productoService.remove(+id, userRole); // Llama al método remove del servicio
  }
}