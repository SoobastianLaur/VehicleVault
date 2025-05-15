import { 
  customers, type Customer, type InsertCustomer,
  vehicles, type Vehicle, type InsertVehicle, 
  serviceRecords, type ServiceRecord, type InsertServiceRecord,
  reminders, type Reminder, type InsertReminder,
  type VehicleWithCustomer,
  type ServiceRecordWithVehicle,
  type ReminderWithVehicle
} from "@shared/schema";
import { eq, and, desc, gte, lte } from "drizzle-orm";

export interface IStorage {
  // Customers
  getCustomers(limit?: number, offset?: number): Promise<Customer[]>;
  getCustomerById(id: number): Promise<Customer | undefined>;
  createCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: number): Promise<boolean>;
  getCustomerCount(): Promise<number>;
  
  // Vehicles
  getVehicles(customerId?: number): Promise<Vehicle[]>;
  getVehicleById(id: number): Promise<Vehicle | undefined>;
  getVehicleWithCustomer(id: number): Promise<VehicleWithCustomer | undefined>;
  createVehicle(vehicle: InsertVehicle): Promise<Vehicle>;
  updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined>;
  deleteVehicle(id: number): Promise<boolean>;
  
  // Service Records
  getServiceRecords(vehicleId?: number, limit?: number): Promise<ServiceRecord[]>;
  getServiceRecordById(id: number): Promise<ServiceRecord | undefined>;
  getServiceRecordsWithVehicleInfo(limit?: number): Promise<ServiceRecordWithVehicle[]>;
  createServiceRecord(record: InsertServiceRecord): Promise<ServiceRecord>;
  updateServiceRecord(id: number, record: Partial<InsertServiceRecord>): Promise<ServiceRecord | undefined>;
  deleteServiceRecord(id: number): Promise<boolean>;
  
  // Reminders
  getReminders(vehicleId?: number, includeCompleted?: boolean): Promise<Reminder[]>;
  getReminderById(id: number): Promise<Reminder | undefined>;
  getUpcomingReminders(limit?: number): Promise<ReminderWithVehicle[]>;
  createReminder(reminder: InsertReminder): Promise<Reminder>;
  updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder | undefined>;
  completeReminder(id: number): Promise<Reminder | undefined>;
  deleteReminder(id: number): Promise<boolean>;

  // Dashboard
  getDashboardStats(): Promise<{
    customerCount: number;
    vehicleCount: number;
    monthlyServiceCount: number;
    reminderCount: number;
  }>;
}

export class MemStorage implements IStorage {
  private customers: Map<number, Customer>;
  private vehicles: Map<number, Vehicle>;
  private serviceRecords: Map<number, ServiceRecord>;
  private reminders: Map<number, Reminder>;
  private customerIdCounter: number;
  private vehicleIdCounter: number;
  private serviceRecordIdCounter: number;
  private reminderIdCounter: number;

  constructor() {
    this.customers = new Map();
    this.vehicles = new Map();
    this.serviceRecords = new Map();
    this.reminders = new Map();
    this.customerIdCounter = 1;
    this.vehicleIdCounter = 1;
    this.serviceRecordIdCounter = 1;
    this.reminderIdCounter = 1;

    // Add some sample data
    this.addSampleData();
  }

  private addSampleData() {
    // Sample customers
    const customer1 = this.createCustomer({
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "(555) 123-4567",
    });

    const customer2 = this.createCustomer({
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.j@example.com",
      phone: "(555) 987-6543",
    });

    const customer3 = this.createCustomer({
      firstName: "Mike",
      lastName: "Wilson",
      email: "mike.w@example.com",
      phone: "(555) 456-7890",
    });

    // Sample vehicles
    const vehicle1 = this.createVehicle({
      customerId: customer1.id,
      make: "Toyota",
      model: "Camry",
      year: 2020,
      color: "Blue",
      licensePlate: "ABC1234",
      vin: "1HGBH41JXMN109186",
    });

    const vehicle2 = this.createVehicle({
      customerId: customer2.id,
      make: "Honda",
      model: "Civic",
      year: 2018,
      color: "Silver",
      licensePlate: "XYZ7890",
      vin: "5XXGM4A72CG022862",
    });

    const vehicle3 = this.createVehicle({
      customerId: customer3.id,
      make: "Ford",
      model: "F-150",
      year: 2019,
      color: "Black",
      licensePlate: "DEF4567",
      vin: "1FTEW1E85AFA37516",
    });

    // Sample service records
    const now = new Date();
    
    this.createServiceRecord({
      vehicleId: vehicle1.id,
      serviceDate: new Date(now.getFullYear(), now.getMonth(), 12) as NewDate,
      odometer: 45230,
      problemsNoted: "Engine light on, low oil",
      workDone: "Oil Change and Filter Replacement",
      partsUsed: "Oil filter, 5qt synthetic oil",
      cost: 8500, // $85.00
      photoUrls: [],
      status: "completed",
    });

    this.createServiceRecord({
      vehicleId: vehicle2.id,
      serviceDate: new Date(now.getFullYear(), now.getMonth(), 10) as NewDate,
      odometer: 62450,
      problemsNoted: "Battery not holding charge",
      workDone: "Battery Replacement",
      partsUsed: "New battery",
      cost: 15000, // $150.00
      photoUrls: [],
      status: "completed",
    });

    this.createServiceRecord({
      vehicleId: vehicle3.id,
      serviceDate: new Date(now.getFullYear(), now.getMonth(), 9) as NewDate,
      odometer: 78320,
      problemsNoted: "Transmission slipping",
      workDone: "Transmission Service",
      partsUsed: "Transmission fluid, filter",
      cost: 35000, // $350.00
      photoUrls: [],
      status: "in_progress",
    });

    // Sample reminders
    this.createReminder({
      vehicleId: vehicle1.id,
      title: "Oil Change Due",
      description: "Regular maintenance",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2) as NewDate,
      isComplete: false,
    });

    this.createReminder({
      vehicleId: vehicle2.id,
      title: "Scheduled Maintenance",
      description: "30,000 mile service",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 5) as NewDate,
      isComplete: false,
    });

    this.createReminder({
      vehicleId: vehicle3.id,
      title: "Tire Rotation",
      description: "Rotate tires for even wear",
      dueDate: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7) as NewDate,
      isComplete: false,
    });
  }

  // Customers
  async getCustomers(limit = 10, offset = 0): Promise<Customer[]> {
    const allCustomers = Array.from(this.customers.values());
    return allCustomers.slice(offset, offset + limit);
  }

  async getCustomerById(id: number): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async createCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = this.customerIdCounter++;
    const now = new Date();
    const newCustomer: Customer = { 
      ...customer, 
      id, 
      createdAt: now 
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: number, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existingCustomer = this.customers.get(id);
    if (!existingCustomer) {
      return undefined;
    }

    const updatedCustomer: Customer = {
      ...existingCustomer,
      ...customer,
    };

    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
  }

  async deleteCustomer(id: number): Promise<boolean> {
    // Also delete all related vehicles
    const customerVehicles = Array.from(this.vehicles.values()).filter(v => v.customerId === id);
    for (const vehicle of customerVehicles) {
      await this.deleteVehicle(vehicle.id);
    }
    
    return this.customers.delete(id);
  }

  async getCustomerCount(): Promise<number> {
    return this.customers.size;
  }

  // Vehicles
  async getVehicles(customerId?: number): Promise<Vehicle[]> {
    const allVehicles = Array.from(this.vehicles.values());
    if (customerId) {
      return allVehicles.filter(v => v.customerId === customerId);
    }
    return allVehicles;
  }

  async getVehicleById(id: number): Promise<Vehicle | undefined> {
    return this.vehicles.get(id);
  }

  async getVehicleWithCustomer(id: number): Promise<VehicleWithCustomer | undefined> {
    const vehicle = this.vehicles.get(id);
    if (!vehicle) {
      return undefined;
    }

    const customer = this.customers.get(vehicle.customerId);
    if (!customer) {
      return undefined;
    }

    return { ...vehicle, customer };
  }

  async createVehicle(vehicle: InsertVehicle): Promise<Vehicle> {
    const id = this.vehicleIdCounter++;
    const now = new Date();
    const newVehicle: Vehicle = { 
      ...vehicle, 
      id, 
      createdAt: now 
    };
    this.vehicles.set(id, newVehicle);
    return newVehicle;
  }

  async updateVehicle(id: number, vehicle: Partial<InsertVehicle>): Promise<Vehicle | undefined> {
    const existingVehicle = this.vehicles.get(id);
    if (!existingVehicle) {
      return undefined;
    }

    const updatedVehicle: Vehicle = {
      ...existingVehicle,
      ...vehicle,
    };

    this.vehicles.set(id, updatedVehicle);
    return updatedVehicle;
  }

  async deleteVehicle(id: number): Promise<boolean> {
    // Also delete all related service records and reminders
    const vehicleServiceRecords = Array.from(this.serviceRecords.values()).filter(s => s.vehicleId === id);
    for (const record of vehicleServiceRecords) {
      this.serviceRecords.delete(record.id);
    }

    const vehicleReminders = Array.from(this.reminders.values()).filter(r => r.vehicleId === id);
    for (const reminder of vehicleReminders) {
      this.reminders.delete(reminder.id);
    }
    
    return this.vehicles.delete(id);
  }

  // Service Records
  async getServiceRecords(vehicleId?: number, limit = 10): Promise<ServiceRecord[]> {
    let records = Array.from(this.serviceRecords.values());
    
    // Sort by service date, newest first
    records.sort((a, b) => {
      return new Date(b.serviceDate).getTime() - new Date(a.serviceDate).getTime();
    });
    
    if (vehicleId) {
      records = records.filter(r => r.vehicleId === vehicleId);
    }
    
    return records.slice(0, limit);
  }

  async getServiceRecordById(id: number): Promise<ServiceRecord | undefined> {
    return this.serviceRecords.get(id);
  }

  async getServiceRecordsWithVehicleInfo(limit = 3): Promise<ServiceRecordWithVehicle[]> {
    const records = await this.getServiceRecords(undefined, limit);
    
    return records.map(record => {
      const vehicle = this.vehicles.get(record.vehicleId);
      const customer = vehicle ? this.customers.get(vehicle.customerId) : undefined;
      
      return {
        ...record,
        vehicle: vehicle!,
        customer
      };
    });
  }

  async createServiceRecord(record: InsertServiceRecord): Promise<ServiceRecord> {
    const id = this.serviceRecordIdCounter++;
    const now = new Date();
    const newRecord: ServiceRecord = { 
      ...record, 
      id, 
      createdAt: now 
    };
    this.serviceRecords.set(id, newRecord);
    return newRecord;
  }

  async updateServiceRecord(id: number, record: Partial<InsertServiceRecord>): Promise<ServiceRecord | undefined> {
    const existingRecord = this.serviceRecords.get(id);
    if (!existingRecord) {
      return undefined;
    }

    const updatedRecord: ServiceRecord = {
      ...existingRecord,
      ...record,
    };

    this.serviceRecords.set(id, updatedRecord);
    return updatedRecord;
  }

  async deleteServiceRecord(id: number): Promise<boolean> {
    return this.serviceRecords.delete(id);
  }

  // Reminders
  async getReminders(vehicleId?: number, includeCompleted = false): Promise<Reminder[]> {
    let reminders = Array.from(this.reminders.values());
    
    if (vehicleId) {
      reminders = reminders.filter(r => r.vehicleId === vehicleId);
    }
    
    if (!includeCompleted) {
      reminders = reminders.filter(r => !r.isComplete);
    }
    
    // Sort by due date, soonest first
    reminders.sort((a, b) => {
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
    
    return reminders;
  }

  async getReminderById(id: number): Promise<Reminder | undefined> {
    return this.reminders.get(id);
  }

  async getUpcomingReminders(limit = 3): Promise<ReminderWithVehicle[]> {
    const reminders = await this.getReminders(undefined, false);
    
    return reminders.slice(0, limit).map(reminder => {
      const vehicle = this.vehicles.get(reminder.vehicleId);
      const customer = vehicle ? this.customers.get(vehicle.customerId) : undefined;
      
      return {
        ...reminder,
        vehicle: vehicle!,
        customer
      };
    });
  }

  async createReminder(reminder: InsertReminder): Promise<Reminder> {
    const id = this.reminderIdCounter++;
    const now = new Date();
    const newReminder: Reminder = { 
      ...reminder, 
      id, 
      createdAt: now 
    };
    this.reminders.set(id, newReminder);
    return newReminder;
  }

  async updateReminder(id: number, reminder: Partial<InsertReminder>): Promise<Reminder | undefined> {
    const existingReminder = this.reminders.get(id);
    if (!existingReminder) {
      return undefined;
    }

    const updatedReminder: Reminder = {
      ...existingReminder,
      ...reminder,
    };

    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async completeReminder(id: number): Promise<Reminder | undefined> {
    const existingReminder = this.reminders.get(id);
    if (!existingReminder) {
      return undefined;
    }

    const updatedReminder: Reminder = {
      ...existingReminder,
      isComplete: true,
    };

    this.reminders.set(id, updatedReminder);
    return updatedReminder;
  }

  async deleteReminder(id: number): Promise<boolean> {
    return this.reminders.delete(id);
  }

  // Dashboard
  async getDashboardStats(): Promise<{ customerCount: number; vehicleCount: number; monthlyServiceCount: number; reminderCount: number; }> {
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    // Count services this month
    const services = Array.from(this.serviceRecords.values());
    const monthlyServices = services.filter(service => {
      const serviceDate = new Date(service.serviceDate);
      return serviceDate >= firstDayOfMonth && serviceDate <= now;
    });
    
    // Count upcoming reminders
    const pendingReminders = Array.from(this.reminders.values()).filter(r => !r.isComplete);
    
    return {
      customerCount: this.customers.size,
      vehicleCount: this.vehicles.size,
      monthlyServiceCount: monthlyServices.length,
      reminderCount: pendingReminders.length
    };
  }
}

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Set up PostgreSQL connection
const connectionString = process.env.DATABASE_URL;
let storage: IStorage;

if (!connectionString) {
  console.error("DATABASE_URL is not set! Using in-memory storage as fallback.");
  storage = new MemStorage();
} else {
  try {
    // Initialize Postgres client
    const client = postgres(connectionString, { max: 1 });
    const db = drizzle(client);
    console.log("Successfully connected to PostgreSQL database");
    
    // TODO: Implement PostgreSQL storage using Drizzle ORM
    // For now, use the in-memory storage until we implement the PostgreSQL storage
    storage = new MemStorage();
  } catch (error) {
    console.error("Failed to connect to PostgreSQL database:", error);
    console.warn("Using in-memory storage as fallback");
    storage = new MemStorage();
  }
}

export { storage };
