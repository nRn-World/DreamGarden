import { useGame } from '../game/store';
import { makeT } from '../i18n';
import SheetFrame from './SheetFrame';
import TrailMap from './TrailMap';

export default function BookSheet() {
  const locale = useGame((s) => s.save.locale ?? 'en');
  const t = makeT(locale);
  return (
    <SheetFrame title={t('book.title')} subtitle={t('book.lead')} className="book-sheet">
      <TrailMap />
    </SheetFrame>
  );
}
