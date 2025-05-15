import { FC } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { Users, Car, Wrench, Bell, ArrowRight } from "lucide-react";
import { DashboardStats } from "@/types";

interface StatCardsProps {
  stats?: DashboardStats;
  isLoading: boolean;
}

interface StatCardProps {
  title: string;
  value: number | string;
  icon: React.ReactNode;
  linkUrl: string;
  linkText: string;
  isLoading: boolean;
}

const StatCard: FC<StatCardProps> = ({ title, value, icon, linkUrl, linkText, isLoading }) => (
  <Card className="bg-white overflow-hidden shadow rounded-lg">
    <CardContent className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-5 w-0 flex-1">
          <dl>
            <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
            <dd>
              {isLoading ? (
                <Skeleton className="h-7 w-12 mt-1" />
              ) : (
                <div className="text-lg font-semibold text-gray-900">{value}</div>
              )}
            </dd>
          </dl>
        </div>
      </div>
    </CardContent>
    <CardFooter className="bg-gray-50 px-5 py-3">
      <div className="text-sm">
        <Link href={linkUrl}>
          <div className="font-medium text-primary hover:text-blue-700 flex items-center cursor-pointer">
            {linkText}
            <ArrowRight className="ml-1 h-4 w-4" />
          </div>
        </Link>
      </div>
    </CardFooter>
  </Card>
);

const StatCards: FC<StatCardsProps> = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Active Customers"
        value={stats?.customerCount || 0}
        icon={<Users className="h-5 w-5 text-blue-500" />}
        linkUrl="/customers"
        linkText="View all"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Total Vehicles"
        value={stats?.vehicleCount || 0}
        icon={<Car className="h-5 w-5 text-green-500" />}
        linkUrl="/vehicles"
        linkText="View all"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Services This Month"
        value={stats?.monthlyServiceCount || 0}
        icon={<Wrench className="h-5 w-5 text-purple-500" />}
        linkUrl="/service-records"
        linkText="View details"
        isLoading={isLoading}
      />
      
      <StatCard
        title="Pending Reminders"
        value={stats?.reminderCount || 0}
        icon={<Bell className="h-5 w-5 text-amber-500" />}
        linkUrl="/reminders"
        linkText="View all"
        isLoading={isLoading}
      />
    </div>
  );
};

export default StatCards;
