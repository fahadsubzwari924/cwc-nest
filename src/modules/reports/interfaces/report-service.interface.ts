import { ReportFilters, ReportTypeDto } from '../dtos/order-reports.dto';

export interface IReportService {
  generateReport(
    reportTypes: Array<ReportTypeDto>,
    reportFilters?: ReportFilters,
  ): Promise<any>;
}
