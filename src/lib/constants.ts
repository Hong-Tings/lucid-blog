export const SITE_TITLE = 'Lucid';
export const SITE_DESCRIPTION = '一个开发者的数字花园 — 创造·探索·记录';

const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export const NAV_ITEMS = [
  { href: `${base}/`, label: '首页' },
  { href: `${base}/blog`, label: '文章' },
  { href: `${base}/projects`, label: '项目' },
  { href: `${base}/growth`, label: '成长' },
  { href: `${base}/guestbook`, label: '留言' },
] as const;

export const CATEGORIES = ['全部', '技术', '生活', '随笔', '创作'] as const;

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: '#', icon: 'github' },
  { name: 'Twitter', url: '#', icon: 'twitter' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: 'mail' },
] as const;
