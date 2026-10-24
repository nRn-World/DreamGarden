import { useGame } from '../game/store';
import { BasketSheet, PlantSheet, PlotSheet, SeedSheet } from './SeedsSheets';
import SpiritSheet from './SpiritSheet';
import StorySheet from './StorySheet';
import BookSheet from './BookSheet';
import NightSheet from './NightSheet';
import SettingsSheet from './SettingsSheet';
import { AchievementsSheet, CreditsSheet, DailySheet, OfflineSheet, PrivacySheet } from './MetaSheets';

export default function SheetHost() {
  const sheet = useGame((s) => s.sheet);
  if (!sheet) return null;

  switch (sheet.kind) {
    case 'seed':
      return <SeedSheet key={`seed-${sheet.plot}`} plotIndex={sheet.plot} />;
    case 'plant':
      return <PlantSheet key={`plant-${sheet.plot}`} plotIndex={sheet.plot} />;
    case 'plot':
      return <PlotSheet key={`plot-${sheet.plot}`} plotIndex={sheet.plot} />;
    case 'spirit':
      return <SpiritSheet key={`spirit-${sheet.id}`} id={sheet.id} />;
    case 'story':
      return <StorySheet key={`story-${sheet.index}`} index={sheet.index} />;
    case 'book':
      return <BookSheet key="book" />;
    case 'night':
      return <NightSheet key="night" />;
    case 'settings':
      return <SettingsSheet key="settings" />;
    case 'daily':
      return <DailySheet key="daily" />;
    case 'offline':
      return <OfflineSheet key="offline" />;
    case 'achievements':
      return <AchievementsSheet key="achievements" />;
    case 'basket':
      return <BasketSheet key="basket" />;
    case 'privacy':
      return <PrivacySheet key="privacy" />;
    case 'credits':
      return <CreditsSheet key="credits" />;
    default:
      return null;
  }
}
