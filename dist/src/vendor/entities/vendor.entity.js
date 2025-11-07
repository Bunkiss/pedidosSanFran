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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Vendor = void 0;
const typeorm_1 = require("typeorm");
const vendor_schedule_entity_1 = require("../../vendor-schedule/entities/vendor-schedule.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const product_entity_1 = require("../../product/entities/product.entity");
const order_entity_1 = require("../../order/entities/order.entity");
let Vendor = class Vendor {
    id;
    nombre;
    categoria;
    schedules;
    user;
    products;
    orders;
    createdAt;
    updatedAt;
};
exports.Vendor = Vendor;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Vendor.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vendor.prototype, "nombre", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Vendor.prototype, "categoria", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => vendor_schedule_entity_1.VendorSchedule, schedule => schedule.vendor, { cascade: true }),
    __metadata("design:type", Array)
], Vendor.prototype, "schedules", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => user_entity_1.User, { eager: true }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], Vendor.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => product_entity_1.Product, product => product.vendor, { cascade: true }),
    __metadata("design:type", Array)
], Vendor.prototype, "products", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => order_entity_1.Order, (order) => order.vendor),
    __metadata("design:type", Array)
], Vendor.prototype, "orders", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Vendor.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Vendor.prototype, "updatedAt", void 0);
exports.Vendor = Vendor = __decorate([
    (0, typeorm_1.Entity)('vendors')
], Vendor);
//# sourceMappingURL=vendor.entity.js.map