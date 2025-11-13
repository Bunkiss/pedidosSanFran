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
exports.VendorScheduleService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const vendor_schedule_entity_1 = require("./entities/vendor-schedule.entity");
const vendor_entity_1 = require("../vendor/entities/vendor.entity");
let VendorScheduleService = class VendorScheduleService {
    vendorScheduleRepository;
    vendorRepository;
    constructor(vendorScheduleRepository, vendorRepository) {
        this.vendorScheduleRepository = vendorScheduleRepository;
        this.vendorRepository = vendorRepository;
    }
    async create(dto) {
        const vendor = await this.vendorRepository.findOne({ where: { id: dto.vendorId } });
        if (!vendor)
            throw new common_1.NotFoundException(`Vendor con id ${dto.vendorId} no encontrado`);
        const schedule = this.vendorScheduleRepository.create({
            dia: dto.dia,
            horaApertura: dto.horaApertura,
            horaCierre: dto.horaCierre,
            vendor,
        });
        return this.vendorScheduleRepository.save(schedule);
    }
    findAll() {
        return this.vendorScheduleRepository.find({ relations: ['vendor'] });
    }
    async findOne(id) {
        const schedule = await this.vendorScheduleRepository.findOne({
            where: { id },
            relations: ['vendor'],
        });
        if (!schedule)
            throw new common_1.NotFoundException(`Horario con id ${id} no encontrado`);
        return schedule;
    }
    async update(id, dto) {
        const schedule = await this.findOne(id);
        if (dto.vendorId) {
            const vendor = await this.vendorRepository.findOne({ where: { id: dto.vendorId } });
            if (!vendor)
                throw new common_1.NotFoundException(`Vendor con id ${dto.vendorId} no encontrado`);
            schedule.vendor = vendor;
        }
        Object.assign(schedule, dto);
        return this.vendorScheduleRepository.save(schedule);
    }
    async remove(id) {
        const schedule = await this.findOne(id);
        await this.vendorScheduleRepository.remove(schedule);
    }
};
exports.VendorScheduleService = VendorScheduleService;
exports.VendorScheduleService = VendorScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(vendor_schedule_entity_1.VendorSchedule)),
    __param(1, (0, typeorm_1.InjectRepository)(vendor_entity_1.Vendor)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], VendorScheduleService);
//# sourceMappingURL=vendor-schedule.service.js.map