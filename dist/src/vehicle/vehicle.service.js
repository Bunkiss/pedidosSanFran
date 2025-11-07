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
exports.VehicleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vehicle_entity_1 = require("./entities/vehicle.entity");
const driver_entity_1 = require("../driver/entities/driver.entity");
let VehicleService = class VehicleService {
    vehicleRepo;
    driverRepo;
    constructor(vehicleRepo, driverRepo) {
        this.vehicleRepo = vehicleRepo;
        this.driverRepo = driverRepo;
    }
    async create(dto) {
        const driver = await this.driverRepo.findOne({ where: { id: dto.driverId } });
        if (!driver)
            throw new common_1.NotFoundException(`Driver con ID ${dto.driverId} no encontrado`);
        const vehicle = this.vehicleRepo.create({
            tipo: dto.tipo,
            marca: dto.marca,
            modelo: dto.modelo,
            patente: dto.patente,
            activo: dto.activo ?? true,
            driver,
        });
        return await this.vehicleRepo.save(vehicle);
    }
    findAll() {
        return this.vehicleRepo.find({ relations: ['driver'] });
    }
};
exports.VehicleService = VehicleService;
exports.VehicleService = VehicleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vehicle_entity_1.Vehicle)),
    __param(1, (0, typeorm_1.InjectRepository)(driver_entity_1.Driver)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VehicleService);
//# sourceMappingURL=vehicle.service.js.map