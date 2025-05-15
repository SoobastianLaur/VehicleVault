import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { fetchDashboardStats, fetchRecentServices, fetchUpcomingReminders, fetchCustomers } from "@/lib/api";
import StatCards from "@/components/dashboard/StatCards";
import RecentServices from "@/components/dashboard/RecentServices";
import UpcomingReminders from "@/components/dashboard/UpcomingReminders";
import CustomerList from "@/components/dashboard/CustomerList";
import NewCustomerModal from "@/components/customers/NewCustomerModal";
import { DashboardStats, ServiceRecordWithVehicle, ReminderWithVehicle } from "@/types";

export default function Dashboard() {
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch dashboard stats
  const { data: stats, isLoading: isLoadingStats } = useQuery<DashboardStats>({
    queryKey: ['/api/dashboard/stats'],
    queryFn: fetchDashboardStats
  });

  // Fetch recent services
  const { data: recentServices, isLoading: isLoadingServices } = useQuery<ServiceRecordWithVehicle[]>({
    queryKey: ['/api/service-records/recent'],
    queryFn: () => fetchRecentServices(3)
  });

  // Fetch upcoming reminders
  const { data: upcomingReminders, isLoading: isLoadingReminders } = useQuery<ReminderWithVehicle[]>({
    queryKey: ['/api/reminders/upcoming'],
    queryFn: () => fetchUpcomingReminders(3)
  });

  // Fetch customers
  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ['/api/customers', currentPage, searchQuery],
    queryFn: () => fetchCustomers(10, (currentPage - 1) * 10)
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-white shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
            <div className="ml-auto">
              <Button onClick={() => setIsNewCustomerModalOpen(true)}>
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                New Customer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Stats section */}
        <StatCards 
          stats={stats} 
          isLoading={isLoadingStats} 
        />

        {/* Recent Services & Upcoming Reminders */}
        <div className="mt-8 grid grid-cols-1 gap-5 lg:grid-cols-2">
          <RecentServices 
            services={recentServices} 
            isLoading={isLoadingServices} 
          />
          <UpcomingReminders 
            reminders={upcomingReminders} 
            isLoading={isLoadingReminders} 
          />
        </div>

        {/* Customers List */}
        <div className="mt-8">
          <CustomerList 
            customers={customersData?.customers}
            totalCustomers={customersData?.count || 0}
            currentPage={currentPage}
            totalPages={Math.ceil((customersData?.count || 0) / 10)}
            isLoading={isLoadingCustomers}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
          />
        </div>
      </div>
      
      {/* New Customer Modal */}
      <NewCustomerModal 
        isOpen={isNewCustomerModalOpen} 
        onClose={() => setIsNewCustomerModalOpen(false)} 
      />
    </>
  );
}
