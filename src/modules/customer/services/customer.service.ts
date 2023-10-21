import { NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ICustomer } from 'src/core/interfaces/customer.interface';
import { Customer } from 'src/entities/customer.entity';
import { Repository } from 'typeorm';

export class CustomerService {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  async getAllCustomers(): Promise<Array<Customer>> {
    const customer = this.customerRepository.find();
    return customer;
  }

  async getCustomerById(id: number): Promise<Customer> {
    const customer = await this.customerRepository.findOne({
      where: {
        id: id,
      },
    });
    if (customer) {
      return customer;
    }
    throw new NotFoundException('Could not find the customer');
  }

  async createCustomer(customer: ICustomer): Promise<Customer> {
    const newCustomer = this.customerRepository.create(customer);
    await this.customerRepository.save(newCustomer);
    return newCustomer;
  }
}
