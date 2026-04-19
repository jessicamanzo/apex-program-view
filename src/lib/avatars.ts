import avatarSarah from "@/assets/avatar-sarah.jpg";
import avatarMarcus from "@/assets/avatar-marcus.jpg";
import avatarDavid from "@/assets/avatar-david.jpg";
import avatarEmily from "@/assets/avatar-emily.jpg";
import avatarLisa from "@/assets/avatar-lisa.jpg";
import avatarJames from "@/assets/avatar-james.jpg";
import avatarRaj from "@/assets/avatar-raj.jpg";
import avatarAna from "@/assets/avatar-ana.jpg";
import avatarJessica from "@/assets/jessica-avatar.jpg";

const avatarMap: Record<string, string> = {
  SC: avatarSarah,
  MR: avatarMarcus,
  DP: avatarDavid,
  EW: avatarEmily,
  LN: avatarLisa,
  JO: avatarJames,
  RP: avatarRaj,
  AK: avatarAna,
  JM: avatarJessica,
};

export function getAvatarUrl(initials: string): string | undefined {
  return avatarMap[initials];
}
