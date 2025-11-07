"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendorScheduleModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const vendor_schedule_entity_1 = require("./entities/vendor-schedule.entity");
const vendor_entity_1 = require("../vendor/entities/vendor.entity");
const vendor_schedule_service_1 = require("./vendor-schedule.service");
const vendor_schedule_controller_1 = require("./vendor-schedule.controller");
let VendorScheduleModule = class VendorScheduleModule {
};
exports.VendorScheduleModule = VendorScheduleModule;
exports.VendorScheduleModule = VendorScheduleModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([vendor_schedule_entity_1.VendorSchedule, vendor_entity_1.Vendor])],
        controllers: [vendor_schedule_controller_1.VendorScheduleController],
        providers: [vendor_schedule_service_1.VendorScheduleService],
        exports: [vendor_schedule_service_1.VendorScheduleService],
    })
], VendorScheduleModule);
//# sourceMappingURL=vendor-schedule.module.js.map