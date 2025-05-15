import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchReminders, completeReminder } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusIcon, Search, BellRing, Calendar, Check, Info } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Reminder, ReminderWithVehicle } from "@/types";
import { Badge } from "@/components/ui/badge";
import { formatDueDate, getDueDateClassName } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

export default function Reminders() {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: reminders, isLoading } = useQuery({
    queryKey: ['/api/reminders'],
    queryFn: () => fetchReminders(undefined, false)
  });

  const completeMutation = useMutation({
    mutationFn: completeReminder,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/reminders'] });
      toast({
        title: "Reminder completed",
        description: "The reminder has been marked as complete.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to complete the reminder.",
        variant: "destructive",
      });
    }
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search logic
  };

  const handleCompleteReminder = (id: number) => {
    completeMutation.mutate(id);
  };

  return (
    <>
      {/* Page header */}
      <div className="bg-white dark:bg-gray-800 shadow">
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">Reminders</h1>
            <div className="mt-4 sm:mt-0 flex space-x-3">
              <form onSubmit={handleSearch} className="relative flex-grow max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <Input
                  type="text"
                  placeholder="Search reminders..."
                  className="pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
              <Button>
                <PlusIcon className="-ml-1 mr-2 h-4 w-4" />
                New Reminder
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
              {reminders?.length ? (
                reminders.map((reminder: ReminderWithVehicle) => (
                  <div key={reminder.id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-14 w-14 bg-amber-100 dark:bg-amber-800/60 rounded-lg flex items-center justify-center text-amber-600 dark:text-amber-200">
                        <BellRing className="h-6 w-6" />
                      </div>
                      <div className="ml-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                          {reminder.title}
                        </h2>
                        {reminder.description && (
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {reminder.description}
                          </p>
                        )}
                        <div className="mt-1 flex items-center text-sm space-x-4">
                          <div className="flex items-center">
                            <Calendar className="mr-1 h-4 w-4" />
                            <span className={getDueDateClassName(reminder.dueDate) + " dark:text-white"}>
                              {formatDueDate(reminder.dueDate)}
                            </span>
                          </div>
                          {reminder.vehicle && (
                            <div className="flex items-center text-gray-500 dark:text-gray-400">
                              <Info className="mr-1 h-4 w-4" />
                              <span>
                                {reminder.vehicle.make} {reminder.vehicle.model} {reminder.vehicle.year}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      {!reminder.isComplete && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="mr-2 bg-green-50 text-green-700 border-green-300 hover:bg-green-100 dark:bg-green-800/60 dark:text-green-200 dark:border-green-700 dark:hover:bg-green-800/80"
                          onClick={() => handleCompleteReminder(reminder.id)}
                        >
                          <Check className="mr-1 h-4 w-4" />
                          Complete
                        </Button>
                      )}
                      <Button variant="outline" size="sm" className="dark:border-amber-600 dark:text-amber-300 dark:hover:bg-amber-900/30">View</Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                  No reminders found. Add a new reminder to get started.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* New Reminder Modal would go here */}
    </>
  );
}
