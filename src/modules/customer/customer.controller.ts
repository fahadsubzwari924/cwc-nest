import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Customer } from 'src/entities/customer.entity';
import { CreateCustomerDto } from './dtos/create-customer.dto';
import { CustomerService } from './services/customer.service';

@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  async getAllProducts() {
    try {
      const products = await this.customerService.getAllCustomers();
      return {
        records: products,
        metadata: {
          count: products.length,
        },
      };
    } catch (error) {
      console.log(error);
    }
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Customer> {
    const customer = await this.customerService.getCustomerById(Number(id));
    return customer;
  }

  @Post()
  async createProduct(@Body() customer: CreateCustomerDto) {
    const newCustomer = await this.customerService.createCustomer(customer);
    return newCustomer;
  }
}
