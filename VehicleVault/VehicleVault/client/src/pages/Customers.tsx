import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchCustomers } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search } from "lucide-react";
import NewCustomerModal from "@/components/customers/NewCustomerModal";
import { Skeleton } from "@/components/ui/skeleton";
import { getInitials } from "@/lib/utils";
import { Customer } from "@/types";

export default function Customers() {
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: customersData, isLoading } = useQuery({
    queryKey: ['/api/customers', currentPage, searchQuery],
    queryFn: () => fetchCustomers(10, (currentPage - 1) * 10)
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Customers</h1>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <form onSubmit={handleSearch} className="relative flex-grow max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search customers..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button onClick={() => setIsNewCustomerModalOpen(true)}>
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                New Customer
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        <div className="bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg">
          {isLoading ? (
            <div className="p-6 space-y-6">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-start space-x-6">
                  <Skeleton className="h-16 w-16 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-1/3" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/4" />
                  </div>
                  <Skeleton className="h-10 w-20" />
                </div>
              ))}
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {customersData?.customers && customersData.customers.map((customer: Customer) => (
                <div key={customer.id} className="p-6 flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-16 w-16 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <span className="text-gray-600 dark:text-gray-300 font-semibold text-xl">
                        {getInitials(customer.firstName, customer.lastName)}
                      </span>
                    </div>
                    <div className="ml-6">
                      <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">{customer.firstName} {customer.lastName}</h2>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.email}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{customer.phone}</p>
                    </div>
                  </div>
                  <div>
                    <Button variant="outline" size="sm" className="mr-2">View</Button>
                    <Button variant="outline" size="sm">Edit</Button>
                  </div>
                </div>
              ))}
              
              {customersData?.customers && customersData.customers.length === 0 && (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No customers found. Add a new customer to get started.
                </div>
              )}
            </div>
          )}
          
          {/* Pagination - simplified for this page */}
          {!isLoading && customersData?.count && customersData.count > 10 && (
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
              <nav className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(currentPage * 10, customersData.count)}</span> of{" "}
                    <span className="font-medium">{customersData.count}</span> customers
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    disabled={currentPage * 10 >= customersData.count}
                  >
                    Next
                  </Button>
                </div>
              </nav>
            </div>
          )}
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
