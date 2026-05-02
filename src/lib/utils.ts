import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, '').length;
  const minutes = Math.ceil(words / 400);
  return `${minutes} 分钟阅读`;
}
