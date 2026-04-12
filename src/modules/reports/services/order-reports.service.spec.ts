import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from 'src/entities';
import { OrderStatus } from 'src/modules/order/enums/order-setatus.enum';
import { OrderReportsService } from './order-reports.service';

describe('OrderReportsService', () => {
  let service: OrderReportsService;
  let orderRepository: {
    query: jest.Mock;
    createQueryBuilder: jest.Mock;
  };

  beforeEach(async () => {
    orderRepository = {
      query: jest.fn(),
      createQueryBuilder: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderReportsService,
        {
          provide: getRepositoryToken(Order),
          useValue: orderRepository,
        },
      ],
    }).compile();

    service = module.get(OrderReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getMonthlyProfit', () => {
    it('throws when year is missing', async () => {
      await expect(service.getMonthlyProfit({})).rejects.toThrow(
        'year is required for monthly_profit report',
      );
    });

    it('maps 12 months with revenue and profit', async () => {
      orderRepository.query.mockResolvedValue([
        {
          monthName: 'January ',
          revenue: '100.5',
          profit: '40',
        },
        {
          monthName: 'February ',
          revenue: '0',
          profit: '0',
        },
      ]);

      const result = await service.getMonthlyProfit({ year: 2024 });

      expect(orderRepository.query).toHaveBeenCalledWith(expect.any(String), [
        2024,
        OrderStatus.DELIVERED,
      ]);
      expect(result[0]).toEqual({
        month: 'January',
        revenue: 100.5,
        profit: 40,
      });
      expect(result[1]).toEqual({
        month: 'February',
        revenue: 0,
        profit: 0,
      });
    });
  });

  describe('getYearlyProfit', () => {
    it('returns empty array when no valid year range', async () => {
      const qb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          minYear: null,
          maxYear: null,
        }),
      };
      orderRepository.createQueryBuilder.mockReturnValue(qb);

      const result = await service.getYearlyProfit();

      expect(result).toEqual([]);
      expect(orderRepository.query).not.toHaveBeenCalled();
    });

    it('merges revenue and profit by year across the range', async () => {
      const qb = {
        select: jest.fn().mockReturnThis(),
        addSelect: jest.fn().mockReturnThis(),
        getRawOne: jest.fn().mockResolvedValue({
          minYear: '2022',
          maxYear: '2024',
        }),
      };
      orderRepository.createQueryBuilder.mockReturnValue(qb);
      orderRepository.query
        .mockResolvedValueOnce([
          { year: 2022, revenue: '100' },
          { year: 2024, revenue: '300' },
        ])
        .mockResolvedValueOnce([{ year: 2022, profit: '25' }]);

      const result = await service.getYearlyProfit();

      expect(result).toEqual([
        { year: 2022, revenue: 100, profit: 25 },
        { year: 2023, revenue: 0, profit: 0 },
        { year: 2024, revenue: 300, profit: 0 },
      ]);
      expect(orderRepository.query).toHaveBeenCalledTimes(2);
    });
  });
});
