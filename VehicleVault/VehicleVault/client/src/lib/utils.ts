import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, differenceInDays } from "date-fns";
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | undefined): string {
  if (amount === undefined) return '-';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount / 100);
}

export function formatDate(date: Date | string): string {
  if (!date) return '-';
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return format(dateObj, 'MMM dd, yyyy');
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function formatDueDate(dueDate: Date | string): string {
  if (!dueDate) return '';
  
  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const days = differenceInDays(dueDateObj, new Date());
  
  if (days < 0) {
    return `Overdue by ${Math.abs(days)} day${Math.abs(days) !== 1 ? 's' : ''}`;
  } else if (days === 0) {
    return 'Due today';
  } else if (days === 1) {
    return 'Due tomorrow';
  } else if (days <= 7) {
    return `Due in ${days} days`;
  } else {
    return `Due on ${format(dueDateObj, 'MMM dd, yyyy')}`;
  }
}

export function getDueDateClassName(dueDate: Date | string): string {
  if (!dueDate) return '';
  
  const dueDateObj = typeof dueDate === 'string' ? new Date(dueDate) : dueDate;
  const days = differenceInDays(dueDateObj, new Date());
  
  if (days < 0) {
    return 'text-red-600 font-medium';
  } else if (days <= 3) {
    return 'text-amber-600 font-medium';
  } else {
    return 'text-gray-500';
  }
}
