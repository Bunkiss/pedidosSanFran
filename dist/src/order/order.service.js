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
exports.OrderService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("./entities/order.entity");
const vendor_entity_1 = require("../vendor/entities/vendor.entity");
const user_entity_1 = require("../user/entities/user.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
const order_detail_entity_1 = require("../order-detail/entities/order-detail.entity");
const payment_entity_1 = require("../payment/entities/payment.entity");
let OrderService = class OrderService {
    orderRepo;
    vendorRepo;
    userRepo;
    driverRepo;
    detailRepo;
    paymentRepo;
    constructor(orderRepo, vendorRepo, userRepo, driverRepo, detailRepo, paymentRepo) {
        this.orderRepo = orderRepo;
        this.vendorRepo = vendorRepo;
        this.userRepo = userRepo;
        this.driverRepo = driverRepo;
        this.detailRepo = detailRepo;
        this.paymentRepo = paymentRepo;
    }
    async create(dto) {
        const order = this.orderRepo.create({
            estado: dto.estado,
        });
        if (dto.vendorId) {
            const vendor = await this.vendorRepo.findOneBy({ id: dto.vendorId });
            if (vendor)
                order.vendor = vendor;
        }
        if (dto.userId) {
            const user = await this.userRepo.findOneBy({ id: dto.userId });
            if (user)
                order.user = user;
        }
        if (dto.driverId) {
            const driver = await this.driverRepo.findOneBy({ id: dto.driverId });
            if (driver)
                order.driver = driver;
        }
        order.details = dto.details.map((d) => this.detailRepo.create({
            product: { id: d.productId },
            cantidad: d.cantidad,
            subtotal: d.subtotal,
            impuestos: d.impuestos,
            propina: d.propina,
            costo_envio: d.costo_envio,
            metodo_pago: d.metodo_pago,
        }));
        order.total = order.details.reduce((sum, det) => sum + Number(det.subtotal) + Number(det.impuestos) + Number(det.propina) + Number(det.costo_envio), 0);
        return this.orderRepo.save(order);
    }
    findAll() {
        return this.orderRepo.find({
            relations: ['vendor', 'user', 'driver', 'details', 'details.product'],
        });
    }
    async findOne(id) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['vendor', 'user', 'driver', 'details', 'details.product'],
        });
        if (!order)
            throw new common_1.NotFoundException('Orden no encontrada');
        return order;
    }
    async update(id, dto) {
        const order = await this.findOne(id);
        Object.assign(order, dto);
        return this.orderRepo.save(order);
    }
    async remove(id) {
        const order = await this.findOne(id);
        return this.orderRepo.remove(order);
    }
    async payOrder(id, dto) {
        const order = await this.orderRepo.findOne({
            where: { id },
            relations: ['payments'],
        });
        if (!order)
            throw new common_1.NotFoundException('Orden no encontrada');
        const payment = this.paymentRepo.create({
            order,
            monto: dto.monto,
            metodo: dto.metodo,
            estado: 'completado',
        });
        await this.paymentRepo.save(payment);
        order.estado = 'completado';
        await this.orderRepo.save(order);
        return payment;
    }
};
exports.OrderService = OrderService;
exports.OrderService = OrderService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(3, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __param(4, (0, typeorm_1.InjectRepository)(order_detail_entity_1.OrderDetail)),
    __param(5, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], OrderService);
//# sourceMappingURL=order.service.js.map