import { Body, Controller, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Customer } from 'src/entities';
import { Repository } from 'typeorm';
const csv = require('csv-parser');

const CITIES_JSON_FILE = path.join(__dirname, 'filtered_cities.json');
const CVS_FILE_PATH = path.join(__dirname, 'cities.csv');

@Controller('seeding')
export class SeedingController {
  constructor(
    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  @Post()
  async seedProvincesInCustomer(): Promise<any> {
    try {
      // Fetch all customers
      const customers = await this.customerRepository.find();
      //   // Read cities data from JSON file
      const data = await fs.promises.readFile(CITIES_JSON_FILE, 'utf8');
      const cities = JSON.parse(data);

      //   // Update customers with enriched province information
      const enrichedCustomers = this.updateCustomerProvinces(customers, cities);

      // Update each customer in the database
      for (const customer of enrichedCustomers) {
        await this.customerRepository.save(customer);
      }

      return {
        message: 'Customers updated successfully',
        data: { customers: enrichedCustomers },
      };
    } catch (error) {
      console.error('Error updating customers:', error);
      throw error;
    }
  }

  findMatchingCity(customerCity: string, cities: any[]): any {
    const normalizedCustomerCity = customerCity.trim().toLowerCase();
    const matchedCity = cities.find(
      (city) => city.name === normalizedCustomerCity,
    );

    return matchedCity ?? null;
  }

  updateCustomerProvinces(customers: any[], cities: any[]): any[] {
    return customers.map((customer) => {
      const matchingCity = this.findMatchingCity(customer.city, cities);

      if (matchingCity) {
        customer.province = matchingCity.state_name;
      }

      return customer;
    });
  }

  getMissingCities(
    customers: Array<Customer>,
    cities: Array<{ id: string; name: string }>,
  ) {
    const missingCities = [];

    customers.forEach((customer: Customer) => {
      const customerCity = cities.find((city) => city.name === customer.city);
      if (!customerCity) {
        missingCities.push(`${customer.city}_${customer.id}`);
      }
    });
    return missingCities;
  }

  getUniqueCities(strings: string[]): string[] {
    return [...new Set(strings)];
  }
}
