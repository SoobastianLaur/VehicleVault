import { FC } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Calendar, BellOff, Droplet, Settings, Component } from "lucide-react";
import { ReminderWithVehicle } from "@/types";
import { formatDueDate, getDueDateClassName } from "@/lib/utils";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface UpcomingRemindersProps {
  reminders?: ReminderWithVehicle[];
  isLoading: boolean;
}

const ReminderIcon = ({ title }: { title: string }) => {
  const toLowerCase = title.toLowerCase();
  
  if (toLowerCase.includes('oil')) {
    return <Droplet className="text-amber-500" />;
  } else if (toLowerCase.includes('maintenance')) {
    return <Settings className="text-amber-500" />;
  } else if (toLowerCase.includes('tire')) {
    return <Component className="text-amber-500" />;
  } else {
    return <Calendar className="text-amber-500" />;
  }
};

const UpcomingReminders: FC<UpcomingRemindersProps> = ({ reminders, isLoading }) => {
  const { toast } = useToast();

  const handleDismiss = async (id: number) => {
    try {
      await apiRequest('POST', `/api/reminders/${id}/complete`, undefined);
      
      toast({
        title: "Reminder completed",
        description: "The reminder has been marked as complete.",
      });
      
      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: ['/api/reminders/upcoming'] });
      queryClient.invalidateQueries({ queryKey: ['/api/dashboard/stats'] });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to complete the reminder.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="bg-white shadow rounded-lg">
      <CardHeader className="px-6 py-5 border-b border-gray-200">
        <CardTitle className="text-lg font-medium text-gray-900">Upcoming Reminders</CardTitle>
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
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flow-root">
            <ul className="-my-5 divide-y divide-gray-200">
              {reminders && reminders.length > 0 ? (
                reminders.map((reminder) => (
                  <li key={reminder.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <ReminderIcon title={reminder.title} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {reminder.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {reminder.vehicle?.make} {reminder.vehicle?.model} {reminder.vehicle?.year}
                          {reminder.customer && (
                            <span> ({reminder.customer.firstName} {reminder.customer.lastName})</span>
                          )}
                        </p>
                        <div className="mt-1 flex items-center text-xs">
                          <Calendar className="mr-1 h-3 w-3" />
                          <span className={getDueDateClassName(reminder.dueDate)}>
                            {formatDueDate(reminder.dueDate)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <Button 
                          variant="default" 
                          size="icon" 
                          className="rounded-full" 
                          onClick={() => handleDismiss(reminder.id)}
                        >
                          <BellOff className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))
              ) : (
                <li className="py-4 text-center text-gray-500">
                  No upcoming reminders.
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <Button variant="outline" className="w-full" asChild>
          <Link href="/reminders">
            <a>View all reminders</a>
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default UpcomingReminders;
