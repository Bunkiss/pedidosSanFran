import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import ormConfigTest from '../config/ormconfig.test';
import { ProductService } from './product.service';
import { VendorsService } from '../vendor/vendors.service';
import { Product } from './entities/product.entity';
import { Vendor } from '../vendor/entities/vendor.entity';

describe('ProductService (Integration)', () => {
  let module: TestingModule;
  let productService: ProductService;
  let vendorService: VendorsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(ormConfigTest),
        TypeOrmModule.forFeature([Product, Vendor]),
      ],
      providers: [ProductService, VendorsService],
    }).compile();

    productService = module.get(ProductService);
    vendorService = module.get(VendorsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('debería crear un producto asociado a un vendor real', async () => {
    const vendor = await vendorService.create({
      nombre: 'Panadería San Juan',
      categoria: 'Alimentos',
      userId: 1,
    } as any);

    const product = await productService.create({
      nombre: 'Medialunas',
      descripcion: 'Docena de medialunas',
      precio: 1500,
      vendorId: vendor.id,
    });

    expect(product.id).toBeDefined();
    expect(product.vendor.id).toBe(vendor.id);
  });

  it('debería listar los productos con sus vendors', async () => {
    const all = await productService.findAll();
    expect(all.length).toBeGreaterThan(0);
    expect(all[0].vendor).toBeDefined();
  });
});
