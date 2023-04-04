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
exports.Customers = void 0;
const late_payment_entity_1 = require("../../payment_details/entities/late_payment.entity");
const payment_entity_1 = require("../../payment_details/entities/payment.entity");
const property_ads_entity_1 = require("../../property-ads/entities/property-ads.entity");
const typeorm_1 = require("typeorm");
let Customers = class Customers {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Customers.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "firstname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "lastname", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "company_name", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Customers.prototype, "price", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "nationality_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "gender", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "mobileNumber", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'float' }),
    __metadata("design:type", Number)
], Customers.prototype, "advance_Payment", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Customers.prototype, "grace_days", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Customers.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Customers.prototype, "profile_img", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', array: true }),
    __metadata("design:type", Array)
], Customers.prototype, "images", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => property_ads_entity_1.PropertyAds, (property) => property.customers),
    __metadata("design:type", property_ads_entity_1.PropertyAds)
], Customers.prototype, "propertyAds", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.Payment, (payment) => payment.customer, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", payment_entity_1.Payment)
], Customers.prototype, "payment_details", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => late_payment_entity_1.LatePayment, (payment) => payment.customer, {
        onDelete: 'CASCADE',
    }),
    __metadata("design:type", late_payment_entity_1.LatePayment)
], Customers.prototype, "Late_payment", void 0);
Customers = __decorate([
    (0, typeorm_1.Entity)()
], Customers);
exports.Customers = Customers;
//# sourceMappingURL=customer.entity.js.map