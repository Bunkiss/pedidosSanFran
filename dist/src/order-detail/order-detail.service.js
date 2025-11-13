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
exports.OrderDetailService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_detail_entity_1 = require("./entities/order-detail.entity");
const order_entity_1 = require("../order/entities/order.entity");
const product_entity_1 = require("../product/entities/product.entity");
let OrderDetailService = class OrderDetailService {
    detailRepo;
    orderRepo;
    productRepo;
    constructor(detailRepo, orderRepo, productRepo) {
        this.detailRepo = detailRepo;
        this.orderRepo = orderRepo;
        this.productRepo = productRepo;
    }
    async create(orderId, dto) {
        const order = await this.orderRepo.findOneBy({ id: orderId });
        if (!order)
            throw new common_1.NotFoundException('Orden no encontrada');
        const product = await this.productRepo.findOneBy({ id: dto.productId });
        if (!product)
            throw new common_1.NotFoundException('Producto no encontrado');
        const detail = this.detailRepo.create({
            order,
            product,
            cantidad: dto.cantidad,
            subtotal: dto.subtotal,
            impuestos: dto.impuestos ?? 0,
            propina: dto.propina ?? 0,
            costo_envio: dto.costo_envio ?? 0,
            metodo_pago: dto.metodo_pago,
        });
        return this.detailRepo.save(detail);
    }
    findAll() {
        return this.detailRepo.find({
            relations: ['order', 'product'],
        });
    }
    async findOne(id) {
        const detail = await this.detailRepo.findOne({
            where: { id },
            relations: ['order', 'product'],
        });
        if (!detail)
            throw new common_1.NotFoundException('Detalle no encontrado');
        return detail;
    }
    async update(id, dto) {
        const detail = await this.findOne(id);
        if (dto.productId) {
            const product = await this.productRepo.findOneBy({ id: dto.productId });
            if (!product)
                throw new common_1.NotFoundException('Producto no encontrado');
            detail.product = product;
        }
        Object.assign(detail, dto);
        return this.detailRepo.save(detail);
    }
    async remove(id) {
        const detail = await this.findOne(id);
        return this.detailRepo.remove(detail);
    }
};
exports.OrderDetailService = OrderDetailService;
exports.OrderDetailService = OrderDetailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_detail_entity_1.OrderDetail)),
    __param(1, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(2, (0, typeorm_1.InjectRepository)(product_entity_1.Product)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderDetailService);
//# sourceMappingURL=order-detail.service.js.map