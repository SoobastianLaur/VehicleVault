import { apiRequest } from "./queryClient";

export async function fetchDashboardStats() {
  const response = await fetch('/api/dashboard/stats');
  if (!response.ok) {
    throw new Error('Failed to fetch dashboard stats');
  }
  return response.json();
}

export async function fetchRecentServices(limit = 3) {
  const response = await fetch(`/api/service-records/recent?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch recent services');
  }
  return response.json();
}

export async function fetchUpcomingReminders(limit = 3) {
  const response = await fetch(`/api/reminders/upcoming?limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch upcoming reminders');
  }
  return response.json();
}

export async function fetchCustomers(limit = 10, offset = 0) {
  const response = await fetch(`/api/customers?limit=${limit}&offset=${offset}`);
  if (!response.ok) {
    throw new Error('Failed to fetch customers');
  }
  return response.json();
}

export async function createCustomer(customerData: any) {
  return apiRequest('POST', '/api/customers', customerData);
}

export async function createVehicle(vehicleData: any) {
  return apiRequest('POST', '/api/vehicles', vehicleData);
}

export async function fetchVehicles(customerId?: number) {
  const url = customerId ? `/api/vehicles?customerId=${customerId}` : '/api/vehicles';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch vehicles');
  }
  return response.json();
}

export async function fetchServiceRecords(vehicleId?: number) {
  const url = vehicleId ? `/api/service-records?vehicleId=${vehicleId}` : '/api/service-records';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch service records');
  }
  return response.json();
}

export async function fetchReminders(vehicleId?: number, includeCompleted = false) {
  let url = '/api/reminders';
  const params = new URLSearchParams();
  
  if (vehicleId) params.append('vehicleId', vehicleId.toString());
  if (includeCompleted) params.append('includeCompleted', 'true');
  
  if (params.toString()) {
    url += `?${params.toString()}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Failed to fetch reminders');
  }
  return response.json();
}

export async function completeReminder(id: number) {
  return apiRequest('POST', `/api/reminders/${id}/complete`, undefined);
}
