"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateVendorScheduleDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_vendor_schedule_dto_1 = require("./create-vendor-schedule.dto");
class UpdateVendorScheduleDto extends (0, mapped_types_1.PartialType)(create_vendor_schedule_dto_1.CreateVendorScheduleDto) {
}
exports.UpdateVendorScheduleDto = UpdateVendorScheduleDto;
//# sourceMappingURL=update-vendor-schedule.dto.js.map