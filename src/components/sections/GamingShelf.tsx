interface Game {
  title: string;
  platform: string;
  status: 'playing' | 'completed' | 'wishlist';
  hours?: number;
  cover: string;
  story: string;
}

const games: Game[] = [
  { title: 'Elden Ring', platform: 'PC', status: 'playing', hours: 120, cover: '⚔️', story: '开放世界 + 魂系战斗的完美结合，每次被 Boss 虐到怀疑人生，但打过的那一刻又无比上头' },
  { title: '塞尔达传说', platform: 'Switch', status: 'completed', hours: 200, cover: '🗡️', story: '旷野之息是我买 Switch 的唯一理由，后来王国之泪又给了我 200 小时的惊喜' },
  { title: 'Hollow Knight', platform: 'PC', status: 'completed', hours: 60, cover: '🦋', story: '独立游戏的天花板，手绘美术和探索感让人沉醉，万神殿打了整整一周' },
  { title: 'Hades II', platform: 'PC', status: 'playing', hours: 35, cover: '🔥', story: '一代就是 Roguelike 入坑作，二代的战斗手感更爽，每个角色都值得反复体验' },
  { title: '动物森友会', platform: 'Switch', status: 'completed', hours: 150, cover: '🏝️', story: '疫情期间的精神寄托，每天钓鱼种花装饰小岛，治愈了无数个焦虑的夜晚' },
  { title: 'Stardew Valley', platform: 'PC', status: 'wishlist', cover: '🌾', story: '一直想玩但怕上瘾，种田 + 社交 + 探矿的组合太对胃口了' },
];

const statusLabel: Record<string, string> = {
  playing: '进行中',
  completed: '已通关',
  wishlist: '想玩',
};

const statusColor: Record<string, string> = {
  playing: 'bg-white text-black',
  completed: 'bg-warm-700 text-warm-300',
  wishlist: 'bg-warm-800 text-warm-500',
};

export default function GamingShelf() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
      {games.map((game) => (
        <div
          key={game.title}
          className="bg-white/[0.08] backdrop-blur-md border border-white/[0.12] rounded-2xl p-5 group hover:bg-white/[0.12] hover:border-white/[0.2] hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500"
        >
          <div className="flex items-start gap-4">
            <span className="text-3xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">{game.cover}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h4 className="text-sm font-medium text-warm-300">{game.title}</h4>
                <span className={`text-[9px] font-mono tracking-wider px-2 py-0.5 rounded-full ${statusColor[game.status]}`}>
                  {statusLabel[game.status]}
                </span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-warm-500 font-mono">{game.platform}</span>
                {game.hours && (
                  <span className="text-[10px] text-warm-600 font-mono">{game.hours}h</span>
                )}
              </div>
              <p className="text-[11px] text-warm-400 leading-relaxed">{game.story}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
