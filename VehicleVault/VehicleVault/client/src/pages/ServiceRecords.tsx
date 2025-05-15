import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search, WrenchIcon, Banknote, Calendar } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, formatDate } from "@/lib/utils";
import { fetchServiceRecords } from "@/lib/api";
import { ServiceRecord, Vehicle } from "@/types";
import { Badge } from "@/components/ui/badge";

export default function ServiceRecords() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: records, isLoading } = useQuery({
    queryKey: ['/api/service-records'],
    queryFn: () => fetchServiceRecords()
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
  };

  // Function to get the status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">Completed</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">In Progress</Badge>;
      case 'scheduled':
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">Scheduled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Service Records</h1>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <form onSubmit={handleSearch} className="relative flex-grow max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search records..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button>
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                New Record
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
              {records?.length ? (
                records.map((record: ServiceRecord) => (
                  <div key={record.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-indigo-100 dark:bg-indigo-800/60 rounded-lg flex items-center justify-center text-indigo-600 dark:text-indigo-200">
                        <WrenchIcon className="h-6 w-6" />
                      </div>
                      <div className="ml-6">
                        <div className="flex items-center">
                          <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                            {record.workDone}
                          </h2>
                          <div className="ml-2">
                            {getStatusBadge(record.status)}
                          </div>
                        </div>
                        <div className="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span>{formatDate(record.serviceDate)}</span>
                          </div>
                          {record.cost && (
                            <div className="flex items-center">
                              <Banknote className="mr-1 h-4 w-4" />
                              <span>{formatCurrency(record.cost)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Button variant="outline" size="sm" className="mr-2 dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/30">View</Button>
                      <Button variant="outline" size="sm" className="dark:border-indigo-600 dark:text-indigo-300 dark:hover:bg-indigo-900/30">Edit</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No service records found. Add a new service record to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* New Service Record Modal would go here */}
    </>
  );
}
