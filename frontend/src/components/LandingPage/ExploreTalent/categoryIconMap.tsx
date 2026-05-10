import type { ExploreTalentIconKey } from "../../../utils/LandingPage/ExploreTalent";
import type { LucideIcon } from "lucide-react";
import {
  Banknote,
  Building2,
  Code2,
  FileText,
  Megaphone,
  Music,
  Palette,
  Video,
} from "lucide-react";

export const categoryIconMap: Record<ExploreTalentIconKey, LucideIcon> = {
  code: Code2,
  palette: Palette,
  megaphone: Megaphone,
  writing: FileText,
  music: Music,
  video: Video,
  architecture: Building2,
  finance: Banknote,
};
