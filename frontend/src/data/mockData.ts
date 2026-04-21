import type { MonthlySalesPoint, StatsChartPoint, TableRow } from '@/types';

export const statsChartData: StatsChartPoint[] = [
  { month: 'Jan', sales: 180, revenue: 40 },
  { month: 'Feb', sales: 190, revenue: 30 },
  { month: 'Mar', sales: 160, revenue: 50 },
  { month: 'Apr', sales: 170, revenue: 40 },
  { month: 'May', sales: 175, revenue: 55 },
  { month: 'Jun', sales: 170, revenue: 40 },
  { month: 'Jul', sales: 175, revenue: 75 },
  { month: 'Aug', sales: 225, revenue: 100 },
  { month: 'Sep', sales: 215, revenue: 115 },
  { month: 'Oct', sales: 220, revenue: 125 },
  { month: 'Nov', sales: 235, revenue: 150 },
  { month: 'Dec', sales: 235, revenue: 140 },
];

export const monthlySalesData: MonthlySalesPoint[] = [
  { month: 'Jan', value: 150 },
  { month: 'Feb', value: 380 },
  { month: 'Mar', value: 190 },
  { month: 'Apr', value: 290 },
  { month: 'May', value: 170 },
  { month: 'Jun', value: 180 },
  { month: 'Jul', value: 280 },
  { month: 'Aug', value: 100 },
  { month: 'Sep', value: 200 },
  { month: 'Oct', value: 380 },
  { month: 'Nov', value: 290 },
  { month: 'Dec', value: 100 },
];

export const tableData: TableRow[] = [
  { id: 1, user: 'Abram Schleifer', email: 'abramschleifer@gmail.com', position: 'Software Engineer', salary: '$89,500', office: 'Edinburgh', status: 'Hired' },
  { id: 2, user: 'Abram Schleifer', email: 'abramschleifer@gmail.com', position: 'Software Engineer', salary: '$89,500', office: 'Edinburgh', status: 'Hired' },
  { id: 3, user: 'Abram Schleifer', email: 'abramschleifer@gmail.com', position: 'Software Engineer', salary: '$89,500', office: 'Edinburgh', status: 'Hired' },
  { id: 4, user: 'Carla George', email: 'carlageorge@gmail.com', position: 'Integration Specialist', salary: '$15,500', office: 'London', status: 'Pending' },
  { id: 5, user: 'Carla George', email: 'carlageorge@gmail.com', position: 'Integration Specialist', salary: '$15,500', office: 'London', status: 'Pending' },
  { id: 6, user: 'Carla George', email: 'carlageorge@gmail.com', position: 'Integration Specialist', salary: '$15,500', office: 'London', status: 'Pending' },
  { id: 7, user: 'Ekstrom Bothman', email: 'ekstrombothman@gmail.com', position: 'Sales Assistant', salary: '$19,200', office: 'San Francisco', status: 'Hired' },
  { id: 8, user: 'Ekstrom Bothman', email: 'ekstrombothman@gmail.com', position: 'Sales Assistant', salary: '$19,200', office: 'San Francisco', status: 'Hired' },
  { id: 9, user: 'Ekstrom Bothman', email: 'ekstrombothman@gmail.com', position: 'Sales Assistant', salary: '$19,200', office: 'San Francisco', status: 'Hired' },
  { id: 10, user: 'Emery Culhane', email: 'emeryculhane@gmail.com', position: 'Pre-Sales Support', salary: '$23,500', office: 'New York', status: 'Hired' },
];
