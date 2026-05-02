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
      <Card className="h-full hover:scale-[1.02] hover:border-primary/10 transition-all duration-500">
        <div className="text-2xl mb-4">{icon}</div>
        <h3 className="text-sm font-medium text-warm-100/80 group-hover:text-warm-50 transition-colors mb-1">{name}</h3>
        <p className="text-xs text-warm-400/40 mb-4 leading-relaxed">{description}</p>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-warm-500/30 font-mono">⭐ {stars.toLocaleString()}</span>
          <Badge>{language}</Badge>
        </div>
      </Card>
    </a>
  );
}
