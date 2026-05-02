export const SITE_TITLE = 'Lucid 清醒';
export const SITE_DESCRIPTION = '一个开发者的数字花园 — 创造·探索·记录';

export const NAV_ITEMS = [
  { href: '/', label: '首页' },
  { href: '/blog', label: '文章' },
  { href: '/projects', label: '项目' },
  { href: '/gallery', label: '摄影' },
  { href: '/about', label: '关于' },
  { href: '/guestbook', label: '留言' },
  { href: '/links', label: '友链' },
] as const;

export const CATEGORIES = ['全部', '技术', '生活', '随笔', '创作'] as const;

export const SOCIAL_LINKS = [
  { name: 'GitHub', url: '#', icon: 'github' },
  { name: 'Twitter', url: '#', icon: 'twitter' },
  { name: 'Email', url: 'mailto:hello@example.com', icon: 'mail' },
] as const;
