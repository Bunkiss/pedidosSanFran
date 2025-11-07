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
exports.CreateVendorScheduleDto = void 0;
const class_validator_1 = require("class-validator");
class CreateVendorScheduleDto {
    dia;
    horaApertura;
    horaCierre;
    vendorId;
}
exports.CreateVendorScheduleDto = CreateVendorScheduleDto;
__decorate([
    (0, class_validator_1.IsEnum)(['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo']),
    __metadata("design:type", String)
], CreateVendorScheduleDto.prototype, "dia", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
        message: 'La hora de apertura debe tener el formato HH:mm',
    }),
    __metadata("design:type", String)
], CreateVendorScheduleDto.prototype, "horaApertura", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.Matches)(/^([0-1]\d|2[0-3]):([0-5]\d)$/, {
        message: 'La hora de cierre debe tener el formato HH:mm',
    }),
    __metadata("design:type", String)
], CreateVendorScheduleDto.prototype, "horaCierre", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", Number)
], CreateVendorScheduleDto.prototype, "vendorId", void 0);
//# sourceMappingURL=create-vendor-schedule.dto.js.map