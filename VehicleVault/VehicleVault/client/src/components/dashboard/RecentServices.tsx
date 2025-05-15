import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Calendar, Gauge, Wrench, CarFront, Battery, Cog, CheckCircle, AlertCircle } from "lucide-react";
import { ServiceRecordWithVehicle } from "@/types";
import { formatDate } from "@/lib/utils";

interface RecentServicesProps {
  services?: ServiceRecordWithVehicle[];
  isLoading: boolean;
}

const ServiceIcon = ({ workDone }: { workDone: string }) => {
  const toLowerCase = workDone.toLowerCase();
  
  if (toLowerCase.includes('oil')) {
    return <Wrench className="text-gray-500" />;
  } else if (toLowerCase.includes('battery')) {
    return <Battery className="text-gray-500" />;
  } else if (toLowerCase.includes('transmission')) {
    return <Cog className="text-gray-500" />;
  } else {
    return <CarFront className="text-gray-500" />;
  }
};

const RecentServices: FC<RecentServicesProps> = ({ services, isLoading }) => {
  return (
    <Card className="bg-white shadow rounded-lg">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-900">Recent Service Records</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {isLoading ? (
          <div className="space-y-6">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-1/3" />
                </div>
                <Skeleton className="h-6 w-20" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {services && services.length > 0 ? (
                services.map((service) => (
                  <li key={service.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <ServiceIcon workDone={service.workDone} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {service.workDone}
                        </p>
                        <p className="text-sm text-gray-500">
                          {service.vehicle?.make} {service.vehicle?.model} {service.vehicle?.year} 
                          {service.customer && (
                            <span> ({service.customer.firstName} {service.customer.lastName})</span>
                          )}
                        </p>
                        <div className="mt-1 flex items-center text-xs text-gray-500">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span>{formatDate(service.serviceDate)}</span>
                          {service.odometer && (
                            <>
                              <span className="mx-2">•</span>
                              <Gauge className="mr-1 h-3 w-3" />
                              <span>{service.odometer.toLocaleString()} mi</span>
                            </>
                          )}
                        </div>
                      </div>
                      <div>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          service.status === 'completed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {service.status === 'completed' ? (
                            <>
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Completed
                            </>
                          ) : (
                            <>
                              <AlertCircle className="mr-1 h-3 w-3" />
                              In Progress
                            </>
                          )}
                        </span>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">
                  No service records found.
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/service-records">
            <a>View all service records</a>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecentServices;
