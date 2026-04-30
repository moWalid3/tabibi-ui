export enum AppointmentStatus {
  AwaitingPayment = 0,
  Confirmed = 1,
  Completed = 2,
  Canceled = 3,
  Refunded = 4
}

export interface IChartDataPoint {
  date: string;
  total: number;
}

export interface IOverviewMetric {
  total: number;
  percentage: number;
  chartData: IChartDataPoint[];
}

export interface IOverview {
  doctors: IOverviewMetric;
  patients: IOverviewMetric;
  appointments: IOverviewMetric;
  revenue: IOverviewMetric;
}

export interface IPopularDoctor {
  Id: string;
  Name: string;
  img: string;
  department: string;
  bookings: number;
}

export interface ITimeFilter<T> {
  weekly: T[];
  monthly: T[];
  yearly: T[];
}

export interface ITopPatient {
  Id: string;
  Name: string;
  img: string;
  totalPaid: number;
  appointments: number;
}

export interface ITodayAppointment {
  Id: string;
  patientName: string;
  patientImg: string;
  doctorName: string;
  doctorImg: string;
  doctorId: string;
  time: string;
  status: AppointmentStatus;
  pricePaid: number;
}

export interface ITopRatedDoctor {
  Id: string;
  Name: string;
  img: string;
  rate: number;
  reviewsCount: number;
  departmentName: string;
}

export interface IDepartmentCount {
  departmentName: string;
  patientsCount: number;
}

export interface IDepartmentTimeGroup {
  totalPeople: number;
  departments: IDepartmentCount[];
}

export interface ITopDepartments {
  daily: IDepartmentTimeGroup;
  weekly: IDepartmentTimeGroup;
  monthly: IDepartmentTimeGroup;
}

export interface IRecentReview {
  patientName: string;
  img: string;
  reviewText: string;
  Rating: number;
  date: string;
}

export interface ITopDoctorRevenue {
  Id: string;
  Name: string;
  img: string;
  revenue: number;
  departmentName: string;
}

export interface IRevenueByDepartment {
  departmentName: string;
  revenue: number;
}

export interface IAnalyticsDashboard {
  overview: IOverview;
  popularDoctors: ITimeFilter<IPopularDoctor>;
  topPatients: ITopPatient[];
  todayAppointments: ITodayAppointment[];
  topRatedDoctors: ITopRatedDoctor[];
  topDepartments: ITopDepartments;
  recentReviews: IRecentReview[];
  topDoctorsByRevenue: ITimeFilter<ITopDoctorRevenue>;
  revenueByDepartment: IRevenueByDepartment[];
}
