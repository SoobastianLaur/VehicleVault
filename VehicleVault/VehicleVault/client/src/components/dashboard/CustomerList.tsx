import { FC, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { Customer, Vehicle, ServiceRecord } from "@/types";
import { formatDate, getInitials } from "@/lib/utils";

interface CustomerListProps {
  customers?: Customer[];
  vehicles?: Record<number, Vehicle>;
  lastServices?: Record<number, ServiceRecord>;
  totalCustomers: number;
  currentPage: number;
  totalPages: number;
  isLoading: boolean;
  onPageChange: (page: number) => void;
  onSearch: (query: string) => void;
}

const CustomerList: FC<CustomerListProps> = ({
  customers,
  vehicles,
  lastServices,
  totalCustomers,
  currentPage,
  totalPages,
  isLoading,
  onPageChange,
  onSearch,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const getCustomerVehicle = (customerId: number): Vehicle | undefined => {
    if (!vehicles) return undefined;
    return Object.values(vehicles).find(v => v.customerId === customerId);
  };

  const getLastService = (vehicleId: number): ServiceRecord | undefined => {
    if (!lastServices || !vehicleId) return undefined;
    return lastServices[vehicleId];
  };

  return (
    <Card className="bg-white shadow rounded-lg">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium text-gray-900">Recent Customers</CardTitle>
          <form onSubmit={handleSearch} className="relative">
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
        </div>
      </CardHeader>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vehicle</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Service</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              [...Array(3)].map((_, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="ml-4 space-y-1">
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-3 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-32 mt-1" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-3 w-16 mt-1" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Skeleton className="h-4 w-16 ml-auto" />
                  </td>
                </tr>
              ))
            ) : (
              customers && customers.map((customer) => {
                const vehicle = getCustomerVehicle(customer.id);
                const lastService = vehicle ? getLastService(vehicle.id) : undefined;
                
                return (
                  <tr key={customer.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <span className="text-gray-500 font-semibold">
                            {getInitials(customer.firstName, customer.lastName)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{customer.firstName} {customer.lastName}</div>
                          <div className="text-sm text-gray-500">{customer.email}</div>
                          <div className="text-sm text-gray-500">{customer.phone}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {vehicle ? (
                        <>
                          <div className="text-sm text-gray-900">{vehicle.make} {vehicle.model}</div>
                          <div className="text-sm text-gray-500">
                            {vehicle.year} {vehicle.color && `• ${vehicle.color}`} {vehicle.licensePlate && `• ${vehicle.licensePlate}`}
                          </div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No vehicle</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lastService ? (
                        <>
                          <div className="text-sm text-gray-900">{formatDate(lastService.serviceDate)}</div>
                          <div className="text-sm text-gray-500">{lastService.workDone}</div>
                        </>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No services</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Active
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <a href="#" className="text-primary hover:text-blue-900 mr-4">Edit</a>
                      <a href="#" className="text-primary hover:text-blue-900">View</a>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      {!isLoading && (
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
          <nav className="flex items-center justify-between">
            <div className="sm:hidden flex-1 flex justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{(currentPage - 1) * 10 + 1}</span> to{" "}
                  <span className="font-medium">{Math.min(currentPage * 10, totalCustomers)}</span> of{" "}
                  <span className="font-medium">{totalCustomers}</span> customers
                </p>
              </div>
              <div>
                <nav className="inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    // Show pages around current page
                    let pageNum = i + 1;
                    if (totalPages > 5) {
                      if (currentPage > 3) {
                        pageNum = currentPage - 3 + i;
                      }
                      if (pageNum > totalPages - 4 && currentPage > totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      }
                    }
                    
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "outline" : "ghost"}
                        size="icon"
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === pageNum ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-700'
                        }`}
                        onClick={() => onPageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  
                  <Button
                    variant="outline"
                    size="icon"
                    className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </nav>
              </div>
            </div>
          </nav>
        </div>
      )}
    </Card>
  );
};

export default CustomerList;
