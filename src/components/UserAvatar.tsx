import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getAvatarUrl } from "@/lib/avatars";

interface UserAvatarProps {
  initials: string;
  name: string;
  className?: string;
}

export function UserAvatar({ initials, name, className }: UserAvatarProps) {
  const avatarUrl = getAvatarUrl(initials);

  return (
    <Avatar className={cn("h-7 w-7", className)}>
      {avatarUrl && (
        <AvatarImage src={avatarUrl} alt={name} className="object-cover" loading="lazy" />
      )}
      <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}
