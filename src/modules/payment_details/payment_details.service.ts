import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Customers } from '../customer/entities/customer.entity';
import { Repository } from 'typeorm';
import { Payment } from './entities/payment.entity';
import * as moment from 'moment';
import { Cron } from '@nestjs/schedule';
import { LatePayment } from './entities/late_payment.entity';

@Injectable()
export class PaymentDetailsService {
  constructor(
    @InjectRepository(Customers) private customerRepo: Repository<Customers>,
    @InjectRepository(Payment) private paymentRepo: Repository<Payment>,
    @InjectRepository(LatePayment)
    private latepaymentRepo: Repository<LatePayment>,
  ) {}

  async dateFormat(value: any) {
    const db_year: any = moment(value).format('YY');
    const db_month: any = moment(value).format('MMMM');
    return { db_year, db_month };
  }

  @Cron('0 */1 * 1-30 * *')
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
      createpay.payment_type = null;
      createpay.rent = null;
      createpay.un_paid = true;
      createpay.bank_id = null;
      createpay.customer = customerData;
      return await this.paymentRepo.save(createpay);
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }

  async createPayment(
    id: any,
    price: any,
    payment_type: string,
    bank_id: string,
  ) {
    try {
      const currentDate: any = moment().format('DD');
      const currentDay: any = moment().format('D');
      const customerData: any = await this.customerRepo.findOne({
        where: { id },
      });

      if (customerData) {
        if (currentDay >= 1 && currentDate < 11) {
          const createPayment = new Payment();
          createPayment.payment_type = payment_type;
          createPayment.paid = true;
          createPayment.rent = price;
          createPayment.bank_id = bank_id;
          createPayment.customer = customerData;
          const res = await this.paymentRepo.save(createPayment);
          if (res)
            return {
              status: 200,
              customer_id: id,
              message: 'Payment Send Successfully',
            };
        } else {
          const createPayment = new LatePayment();
          createPayment.payment_type = payment_type;
          createPayment.paid = true;
          createPayment.rent = price;
          createPayment.bank_id = bank_id;
          createPayment.customer = customerData;
          const res = await this.latepaymentRepo.save(createPayment);
          if (res)
            return {
              status: 200,
              customer_id: id,
              message: 'Payment Send Successfully',
            };
        }
      } else {
        throw new HttpException('Customer Not Exist', HttpStatus.BAD_REQUEST);
      }
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.BAD_REQUEST);
    }
  }
}
