import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from '../customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import * as moment from 'moment';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LatePayment } from './entities/late_payment.entity';
import { PropertyAds } from '../property-ads/entities/property-ads.entity';

@Injectable()
export class PaymentDetailsService {
  constructor(
    @InjectRepository(Customers) private customerRepo: Repository<Customers>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(PropertyAds)
    private propertyRepo: Repository<PropertyAds>,
    @InjectRepository(LatePayment)
    private latepaymentRepo: Repository<LatePayment>,
  ) {}

  async dateFormat(value: any) {
    const db_year: any = moment(value).format('YY');
    const db_month: any = moment(value).format('MMMM');
    return { db_year, db_month };
  }

  @Cron('0 */1 * 1-30 */12 *')
  async checkDate() {
    try {
      const currentMonth = moment().format('MMMM');
      const currentYear = moment().format('YY');

      const allcustomerData: any = await this.customerRepo
        .createQueryBuilder('customers')
        .getMany();

      if (allcustomerData.length) {
        allcustomerData.forEach(async (customerid: any) => {
          const customerData: any = await this.customerRepo
            .createQueryBuilder('customers')
            .where('customers.id =:id', {
              id: customerid.id,
            })
            .leftJoinAndSelect('customers.payment_details', 'payment_details')
            .leftJoinAndSelect('customers.Late_payment', 'Late_payment')
            .getOne();

          const { payment_details, Late_payment } = customerData;
          if (Object.keys(payment_details).length) {
            Object.keys(payment_details).forEach(async (key, i) => {
              const value = payment_details[`${key}`].created_date;
              const id = payment_details[`${key}`].id;
              const rent = payment_details[`${key}`].rent;
              const { db_year, db_month } = await this.dateFormat(value);
              if (currentYear == db_year) {
                if (db_month == currentMonth && rent == null) {
                  if (Object.keys(payment_details).length > i + 1) {
                    const date = payment_details[i + 1].created_date;
                    const Rent = payment_details[i + 1].rent;
                    const { db_year, db_month } = await this.dateFormat(date);
                    if (db_month == currentMonth && Rent != null) {
                      return this.delNullPayment(id);
                    }
                  } else {
                    if (Object.keys(Late_payment).length) {
                      Object.keys(Late_payment).forEach(async (key, i) => {
                        const date = Late_payment[`${key}`].created_date;
                        const { db_year, db_month } = await this.dateFormat(
                          date,
                        );
                        if (currentYear == db_year) {
                          if (db_month == currentMonth) {
                            if (Object.keys(Late_payment).length == i + 1) {
                              return this.delNullPayment(id);
                            }
                          }
                        }
                      });
                    }
                  }
                }
              }
            });
          } else {
            return this.defaultPayment(customerid.id);
          }
        });
      }
    } catch (err) {
      console.log(err);
    }
  }

  @Cron(CronExpression.EVERY_1ST_DAY_OF_MONTH_AT_MIDNIGHT)
  async PaymentCheck() {
    try {
      const res = await this.propertyRepo.find();
      for (let i in res) {
        await this.PaymentUpdate(res[i].id);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async delNullPayment(value: any) {
    try {
      return await this.paymentRepo.delete({ id: value });
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async defaultPayment(id: any) {
    try {
      const customerData: any = await this.customerRepo.findOne({
        where: { id },
      });
      const createpay = new Payment();
      Object.keys(createpay).forEach((key) => {
        createpay[`${key}`] = null;
        createpay.un_paid = true;
        createpay.customer = customerData;
      });
      return await this.paymentRepo.save(createpay);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createPayment(
    id: any,
    price: any,
    payment_type: string,
    check_no: string,
    bank_name: string,
    link_name: string,
    link: string,
    being_of: string,
  ) {
    try {
      const currentDate: any = moment().format('DD');
      const propertyData: any = await this.propertyRepo.findOne({
        where: { id },
      });

      const { customers } = propertyData;

      if (customers?.length) {
        customers.forEach(async (value: any) => {
          if (currentDate >= 1 && currentDate < 11) {
            const createPayment = new Payment();
            createPayment.payment_type = payment_type;
            createPayment.paid = true;
            createPayment.rent = price;
            createPayment.bank_name = bank_name;
            createPayment.check_no = check_no;
            createPayment.link = link;
            createPayment.link_name = link_name;
            createPayment.being_of = being_of;
            createPayment.customer = value;
            const res = await this.paymentRepo.save(createPayment);
            if (res) {
              await this.PaymentUpdate(id);
              return {
                status: 200,
                customer_id: id,
                message: 'Payment Send Successfully',
              };
            }
          } else {
            const createPayment = new LatePayment();
            createPayment.payment_type = payment_type;
            createPayment.paid = true;
            createPayment.rent = price;
            createPayment.bank_name = bank_name;
            createPayment.check_no = check_no;
            createPayment.link = link;
            createPayment.link_name = link_name;
            createPayment.being_of = being_of;
            createPayment.customer = value;
            const res = await this.latepaymentRepo.save(createPayment);
            if (res) {
              await this.PaymentUpdate(id);
              return {
                status: 200,
                customer_id: id,
                message: 'Payment Send Successfully',
              };
            }
          }
        });
      } else {
        throw new HttpException('Customer Not Exist', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async update(body: any) {
    try {
      const { propert_id } = body;
      const currentDate: any = moment().format('DD');

      const res = await this.propertyRepo
        .createQueryBuilder('propertyAds')
        .where('propertyAds.id =:id', { id: propert_id })
        .leftJoinAndSelect('propertyAds.customers', 'customers')
        .leftJoinAndSelect('customers.payment_details', 'payment_details')
        .leftJoinAndSelect('customers.Late_payment', 'Late_payment')
        .getOne();

      const { customers } = res;
      for (let x in customers) {
        const { payment_details, Late_payment } = customers[x] as any;
        if (currentDate >= 1 && currentDate < 11) {
          if (payment_details.length) {
            for (let i = 0; i < payment_details.length; i++) {
              if (i == payment_details.length - 1) {
                const updatePayment = await this.paymentRepo.findOne({
                  where: { id: payment_details[i].id },
                  order: { id: 'ASC' },
                });
                Object.keys(body).forEach((key) => {
                  updatePayment[`${key}`] = body[`${key}`];
                  updatePayment.customer = customers[x];
                });
                await this.paymentRepo.save(updatePayment);
                await this.PaymentUpdate(propert_id);
                return { status: 200, message: 'Successfully Updated' };
              }
            }
          }
        } else {
          if (Late_payment.length) {
            const late_paymentArr = Late_payment;
            for (let i = 0; i < late_paymentArr.length; i++) {
              if (i == late_paymentArr.length - 1) {
                const updatePayment = await this.latepaymentRepo.findOne({
                  where: { id: late_paymentArr[i].id },
                  order: { id: 'ASC' },
                });
                Object.keys(body).forEach((key) => {
                  updatePayment[`${key}`] = body[`${key}`];
                  updatePayment.customer = customers[x];
                });
                await this.latepaymentRepo.save(updatePayment);
                await this.PaymentUpdate(propert_id);
                return { status: 200, message: 'Successfully Updated' };
              }
            }
          }
        }
      }
    } catch (err) {
      console.log(err);
    }
  }

  // customer rent * month and then minus from allpayments
  async PaymentUpdate(id: any) {
    try {
      const propertyData: any = await this.propertyRepo.findOne({
        where: { id },
      });
      const { customers } = propertyData;

      if (customers.length) {
        customers.forEach(async (value: any) => {
          Object.keys(value).forEach(async (key) => {
            const allPayments = [];
            if (key == 'id') {
              const customerData = await this.customerRepo.findOne({
                where: { id: value[key] },
                relations: { Late_payment: true, payment_details: true },
              });
              const { payment_details, Late_payment } = customerData;
              if (Object.keys(payment_details).length) {
                Object.keys(payment_details).forEach((key) => {
                  const rent = payment_details[`${key}`].rent;
                  allPayments.push(rent);
                });
              }
              if (Object.keys(Late_payment).length) {
                Object.keys(Late_payment).forEach((key) => {
                  const rent = Late_payment[`${key}`].rent;
                  allPayments.push(rent);
                });
              }
              const len =
                Object.keys(payment_details).length +
                Object.keys(Late_payment).length;
              const paymentSum = await this.AllPaymentPlus(allPayments, len);
              const createCustomerDate = new Date(
                JSON.stringify(value['created_at']),
              );
              const currentFullDate = new Date();
              const month = await this.getMonthDifference(
                createCustomerDate,
                currentFullDate,
              );
              const adminCustomer: any = await this.PriceOneCustomer(id); // only catch customer which price is not null or NaN
              const monthMultiply = month + 1 * adminCustomer[0].price;
              const total = paymentSum - monthMultiply;
              // console.log(paymentSum, 'sum payment', monthMultiply, 'month');
              // console.log(total, 'total');
              await this.customerUpdate(total, value[key]);
            }
          });
        });
      } else {
        throw new HttpException('Customer Not Exist', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(
        'Error in Remaining Balance',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async customerUpdate(balnce: any, id: number) {
    try {
      if (balnce < 0) {
        await this.customerRepo
          .createQueryBuilder('customers')
          .update()
          .set({ remaining_balnce: balnce })
          .where('id = :id', { id: id })
          .execute();
      } else {
        await this.customerRepo
          .createQueryBuilder('customers')
          .update()
          .set({ advance_balance: balnce, remaining_balnce: 0 })
          .where('id = :id', { id: id })
          .execute();
      }
    } catch (err) {
      throw new HttpException('Error Payment Update', HttpStatus.BAD_REQUEST);
    }
  }

  async AllPaymentPlus(payments: any, len: number) {
    let allnumber = 0;
    if (payments.length == len) {
      payments.forEach((val: any) => {
        allnumber += val;
      });
      return allnumber;
    }
  }

  async PriceOneCustomer(id: number) {
    try {
      const propertyData: any = await this.propertyRepo.findOne({
        where: { id },
      });
      const { customers } = propertyData;
      const adminCustomer = [];
      for (let x in customers) {
        Object.keys(customers[x]).forEach((key) => {
          if (
            key == 'price' &&
            customers[x][key] != null &&
            !Number.isNaN(customers[x][key])
          ) {
            adminCustomer.push(customers[x]);
          }
        });
      }
      return adminCustomer;
    } catch (err) {
      console.log(err);
    }
  }

  async getMonthDifference(startDate: any, endDate: any) {
    return (
      endDate.getMonth() -
      startDate.getMonth() +
      12 * (endDate.getFullYear() - startDate.getFullYear())
    );
  }
}
