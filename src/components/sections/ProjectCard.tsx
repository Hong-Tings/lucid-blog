import Card from '../ui/Card';
import Badge from '../ui/Badge';
import { useMagnetic } from '../effects/useMagnetic';

interface Props {
  icon: string;
  name: string;
  description: string;
  stars: number;
  language: string;
  url: string;
}

export default function ProjectCard({ icon, name, description, stars, language, url }: Props) {
  const magneticRef = useMagnetic({ strength: 0.15, maxTilt: 4 });

  return (
    <a href={url} target="_blank" rel="noopener noreferrer" className="group block">
      <div ref={magneticRef} className="h-full">
        <Card className="h-full">
          <div className="text-2xl mb-4">{icon}</div>
          <h3 className="text-sm font-medium text-warm-700 dark:text-warm-300 group-hover:text-black dark:group-hover:text-white transition-colors mb-1">{name}</h3>
          <p className="text-xs text-warm-400 dark:text-warm-500 mb-4 leading-relaxed">{description}</p>
          <div className="flex items-center gap-3">
            <span className="text-[10px] text-warm-400 dark:text-warm-500 font-mono">⭐ {stars.toLocaleString()}</span>
            <Badge>{language}</Badge>
          </div>
        </Card>
      </div>
    </a>
  );
}
