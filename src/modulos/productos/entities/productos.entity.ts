// src/modulos/productos/entities/productos.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Categoria } from '../../categoria/entities/categoria.entity';
import { DetallePedido } from '../../detalle-pedido/entities/detalle-pedido.entity';

@Entity()
export class Producto {
    @PrimaryGeneratedColumn()
    id_producto: number;

    @Column()
    nombre: string;

    @Column()
    descripcion: string;

    @Column()
    precio: number;

    @Column()
    stock: number;

    @ManyToOne(() => Categoria, categoria => categoria.productos)
    categoria: Categoria;

    @OneToMany(() => DetallePedido, detallePedido => detallePedido.producto)
    detallesPedido: DetallePedido[];
}