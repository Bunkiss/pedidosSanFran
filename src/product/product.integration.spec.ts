import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { Vendor } from '../vendor/entities/vendor.entity';
import { VendorsService } from '../vendor/vendors.service';
import { ENTITIES } from '../config/index';
import { CreateProductDto } from './dto/create-product.dto';
import { CreateVendorDto } from '../vendor/dto/create-vendor.dto';

jest.setTimeout(30000);

describe('ProductService (Integration)', () => {
  let module: TestingModule;
  let productService: ProductService;
  let vendorService: VendorsService;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          dropSchema: true,
          entities: ENTITIES,
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Vendor]),
        TypeOrmModule.forFeature([Vendor, ...ENTITIES]),
      ],
      providers: [ProductService, VendorsService],
    }).compile();

    productService = module.get<ProductService>(ProductService);
    vendorService = module.get<VendorsService>(VendorsService);
  });

  afterAll(async () => {
    await module.close();
  });

  it('debería crear un producto asociado a un vendor real', async () => {
    const vendor: CreateVendorDto = {
      nombre: 'Test Vendor',
      categoria: 'vegetariano',
      userId: 1,
    };

    const createdVendor = await vendorService.create(vendor);

    const product: CreateProductDto = {
      nombre: 'Test Product',
      descripcion: 'Producto de prueba',
      precio: 100,
      vendorId: createdVendor.id,
    };

    const createdProduct = await productService.create(product);
    expect(createdProduct).toBeDefined();
    expect(createdProduct.vendor.id).toBe(createdVendor.id);
  });

  it('debería listar los productos con sus vendors', async () => {
    const products = await productService.findAll();
    expect(Array.isArray(products)).toBe(true);
  });
});
