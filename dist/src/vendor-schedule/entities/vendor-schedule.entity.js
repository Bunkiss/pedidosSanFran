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
exports.VendorSchedule = void 0;
const typeorm_1 = require("typeorm");
const vendor_entity_1 = require("../../vendor/entities/vendor.entity");
let VendorSchedule = class VendorSchedule {
    id;
    dia;
    horaApertura;
    horaCierre;
    vendor;
    vendorId;
    createdAt;
    updatedAt;
};
exports.VendorSchedule = VendorSchedule;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], VendorSchedule.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'] }),
    __metadata("design:type", String)
], VendorSchedule.prototype, "dia", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], VendorSchedule.prototype, "horaApertura", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'time' }),
    __metadata("design:type", String)
], VendorSchedule.prototype, "horaCierre", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => vendor_entity_1.Vendor, vendor => vendor.schedules, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'vendor_id' }),
    __metadata("design:type", vendor_entity_1.Vendor)
], VendorSchedule.prototype, "vendor", void 0);
__decorate([
    (0, typeorm_1.RelationId)((schedule) => schedule.vendor),
    __metadata("design:type", Number)
], VendorSchedule.prototype, "vendorId", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], VendorSchedule.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], VendorSchedule.prototype, "updatedAt", void 0);
exports.VendorSchedule = VendorSchedule = __decorate([
    (0, typeorm_1.Entity)('vendor_schedules')
], VendorSchedule);
//# sourceMappingURL=vendor-schedule.entity.js.map