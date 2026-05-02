import Card from '../ui/Card';
import Badge from '../ui/Badge';

interface Props {
  icon: string;
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
}

export default function ProjectCard({ icon, name, description, stars, language, url }: Props) {
  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group">
      <Card className="h-full hover:scale-[1.02] transition-transform duration-500">
        <div className="text-2xl mb-4">{icon}</div>
        <h3 className="text-sm font-medium text-white/80 group-hover:text-white transition-colors mb-1">{name}</h3>
        <p className="text-xs text-white/40 mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/25 font-mono">⭐ {stars.toLocaleString()}</span>
          <Badge>{language}</Badge>
        </div>
      </Card>
    </a>
  );
}
