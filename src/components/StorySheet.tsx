import { useEffect } from 'react';
import { CHAPTERS } from '../game/content/progression';
import { useGame } from '../game/store';
import { formatNumber, makeT, type DictKey } from '../i18n';
import Icon from './Icon';
import SheetFrame from './SheetFrame';

export default function StorySheet({ index }: { index: number }) {
  const save = useGame((s) => s.save);
  const readChapter = useGame((s) => s.readChapter);
  const openSheet = useGame((s) => s.openSheet);
  const closeSheet = useGame((s) => s.closeSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const chapter = CHAPTERS.find((c) => c.index === index);
  const next = CHAPTERS.find((c) => c.index === index + 1);
  const unlocked = !!chapter && save.level >= chapter.unlockLevel;
  const alreadyRead = save.chaptersRead.includes(index);

  useEffect(() => {
    if (unlocked && !alreadyRead) readChapter(index);
  }, [index, unlocked, alreadyRead, readChapter]);

  if (!chapter) return null;

  return (
    <SheetFrame
      title={t('story.title', { n: formatNumber(locale, index) })}
      subtitle={unlocked ? t(`story.chapterTitle.${index}` as DictKey) : t('story.locked')}
      className="story-sheet"
    >
      <div className={`story-art story-art-${index}`} aria-hidden="true">
        <div className="story-moon" />
        <div className="story-hills" />
        <div className="story-stars">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} style={{ insetInlineStart: `${8 + ((i * 17) % 84)}%`, top: `${12 + ((i * 23) % 52)}%` }} />
          ))}
        </div>
        <Icon name="sparkle" size={22} className="story-flourish" />
      </div>

      {unlocked ? (
        <>
          <h3 className="story-heading">{t(`story.chapterTitle.${index}` as DictKey)}</h3>
          <p className="story-body">{t(`story.chapterBody.${index}` as DictKey)}</p>

          {index === 6 && (
            <div className="finale-card">
              <span className="finale-orb">
                <Icon name="sparkle" size={20} />
              </span>
              <h4>{t('story.finaleTitle')}</h4>
              <p>{t('story.finaleBody')}</p>
              <span className="finale-thanks">{t('story.thanks')}</span>
            </div>
          )}

          <div className="chapter-gift">
            <Icon name="gift" size={16} />
            <span>{t('story.reward')}</span>
            <span className="chapter-gift-value">
              <Icon name="dew" size={13} />
              {formatNumber(locale, chapter.rewardDew)}
              <Icon name="stardust" size={13} />
              {formatNumber(locale, chapter.rewardStardust)}
            </span>
          </div>

          <div className="sheet-actions">
            {next && save.level >= next.unlockLevel ? (
              <button type="button" className="btn btn-primary" onClick={() => openSheet({ kind: 'story', index: next.index })}>
                {t('story.nextChapter')}
                <Icon name="chevron" size={16} />
              </button>
            ) : (
              <button type="button" className="btn btn-soft" onClick={closeSheet}>
                {t('story.close')}
              </button>
            )}
          </div>
        </>
      ) : (
        <p className="sheet-paragraph">{t('journal.locked', { level: chapter.unlockLevel })}</p>
      )}
    </SheetFrame>
  );
}
