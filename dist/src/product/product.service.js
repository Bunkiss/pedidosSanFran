"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const product_entity_1 = require("./entities/product.entity");
const vendor_entity_1 = require("../vendor/entities/vendor.entity");
let ProductService = class ProductService {
    productRepository;
    vendorRepository;
    constructor(productRepository, vendorRepository) {
        this.productRepository = productRepository;
        this.vendorRepository = vendorRepository;
    }
    async create(createProductDto) {
        const { vendorId, ...data } = createProductDto;
        const vendor = await this.vendorRepository.findOne({ where: { id: vendorId } });
        if (!vendor) {
            throw new common_1.NotFoundException(`Vendor con ID ${vendorId} no encontrado`);
        }
        const nuevoProducto = this.productRepository.create({
            ...data,
            vendor,
        });
        return await this.productRepository.save(nuevoProducto);
    }
    async findAll() {
        return await this.productRepository.find({
            relations: ['vendor'],
            order: { id: 'ASC' },
        });
    }
    async findOne(id) {
        const producto = await this.productRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });
        if (!producto) {
            throw new common_1.NotFoundException(`Producto con ID ${id} no encontrado`);
        }
        return producto;
    }
    async update(id, updateProductDto) {
        const producto = await this.findOne(id);
        if (updateProductDto.vendorId) {
            const nuevoVendor = await this.vendorRepository.findOne({
                where: { id: updateProductDto.vendorId },
            });
            if (!nuevoVendor) {
                throw new common_1.NotFoundException(`Vendor con ID ${updateProductDto.vendorId} no encontrado`);
            }
            producto.vendor = nuevoVendor;
        }
        Object.assign(producto, updateProductDto);
        return await this.productRepository.save(producto);
    }
    async remove(id) {
        const producto = await this.findOne(id);
        await this.productRepository.remove(producto);
    }
};
exports.ProductService = ProductService;
exports.ProductService = ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __param(1, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ProductService);
//# sourceMappingURL=product.service.js.map