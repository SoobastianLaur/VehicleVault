import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Car, PlusIcon, Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchVehicles } from "@/lib/api";
import { Vehicle } from "@/types";

export default function Vehicles() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: vehicles, isLoading } = useQuery({
    queryKey: ['/api/vehicles'],
    queryFn: () => fetchVehicles()
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
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Vehicles</h1>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <form onSubmit={handleSearch} className="relative flex-grow max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search vehicles..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button>
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                New Vehicle
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
                  <Skeleton className="h-14 w-14 rounded-lg" />
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
              {vehicles?.length ? (
                vehicles.map((vehicle: Vehicle) => (
                  <div key={vehicle.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-blue-100 dark:bg-blue-800/70 rounded-lg flex items-center justify-center text-blue-600 dark:text-blue-200">
                        <Car className="h-6 w-6" />
                      </div>
                      <div className="ml-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {vehicle.make} {vehicle.model} {vehicle.year}
                        </h2>
                        <div className="flex space-x-4">
                          {vehicle.licensePlate && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium">License:</span> {vehicle.licensePlate}
                            </p>
                          )}
                          {vehicle.color && (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              <span className="font-medium">Color:</span> {vehicle.color}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mr-2 dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30">View</Button>
                      <Button variant="outline" size="sm" className="dark:border-blue-600 dark:text-blue-300 dark:hover:bg-blue-900/30">Edit</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No vehicles found. Add a new vehicle to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* New Vehicle Modal would go here */}
    </>
  );
}
