export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  createdAt: Date;
}

export interface Vehicle {
  id: number;
  customerId: number;
  make: string;
  model: string;
  year: number;
  color?: string;
  licensePlate?: string;
  vin?: string;
  createdAt: Date;
}

export interface ServiceRecord {
  id: number;
  vehicleId: number;
  serviceDate: Date;
  odometer?: number;
  problemsNoted?: string;
  workDone: string;
  partsUsed?: string;
  cost?: number;
  photoUrls?: string[];
  status: "completed" | "in_progress" | "scheduled";
  createdAt: Date;
}

export interface Reminder {
  id: number;
  vehicleId: number;
  title: string;
  description?: string;
  dueDate: Date;
  isComplete: boolean;
  createdAt: Date;
}

export interface VehicleWithCustomer extends Vehicle {
  customer: Customer;
}

export interface ServiceRecordWithVehicle extends ServiceRecord {
  vehicle: Vehicle;
  customer?: Customer;
}

export interface ReminderWithVehicle extends Reminder {
  vehicle: Vehicle;
  customer?: Customer;
}

export interface DashboardStats {
  customerCount: number;
  vehicleCount: number;
  monthlyServiceCount: number;
  reminderCount: number;
}

export interface NewCustomerFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicle?: {
    make: string;
    model: string;
    year: number;
    color?: string;
    licensePlate?: string;
    vin?: string;
  };
}
