import { useEffect, useState } from 'react';
import { CHAPTERS, TALE_COUNT } from '../game/content/progression';
import { useGame } from '../game/store';
import { formatNumber, makeT } from '../i18n';
import { taleFor } from '../i18n/tales';
import Icon from './Icon';
import SheetFrame from './SheetFrame';

export default function StorySheet({ index }: { index: number }) {
  const save = useGame((s) => s.save);
  const readChapter = useGame((s) => s.readChapter);
  const countTale = useGame((s) => s.countTale);
  const openSheet = useGame((s) => s.openSheet);
  const closeSheet = useGame((s) => s.closeSheet);
  const toggleFavTale = useGame((s) => s.toggleFavTale);
  const [speaking, setSpeaking] = useState(false);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const chapter = CHAPTERS.find((c) => c.index === index);
  const next = CHAPTERS.find((c) => c.index === index + 1);
  const tale = taleFor(locale, index);
  const unlocked = !!chapter && save.level >= chapter.unlockLevel;
  const alreadyRead = save.chaptersRead.includes(index);

  useEffect(() => {
    if (!unlocked) return;
    countTale();
    if (!alreadyRead) readChapter(index);
    // Once per opening: counting again when `alreadyRead` flips would double-count the night task.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, unlocked]);

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  if (!chapter || !tale) return null;

  const canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window && save.settings.sound;
  const toggleSpeech = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    }
    const voiceLang: Record<string, string> = { en: 'en-GB', sv: 'sv-SE', tr: 'tr-TR', es: 'es-ES', ar: 'ar-SA', fr: 'fr-FR', ja: 'ja-JP' };
    const utterance = new SpeechSynthesisUtterance([tale.title, ...tale.body, tale.end].join('. '));
    utterance.lang = voiceLang[locale] ?? 'en-GB';
    utterance.rate = 0.85;
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
  };

  return (
    <SheetFrame
      title={t('story.title', { n: formatNumber(locale, index) })}
      subtitle={unlocked ? tale.title : t('story.locked')}
      className="story-sheet"
    >
      <div className={`story-art story-art-${index % 6 || 6}`} aria-hidden="true">
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
          <div className="story-tools">
            {canSpeak && (
              <button type="button" className="sleep-chip" aria-pressed={speaking} onClick={toggleSpeech}>
                <Icon name="sound" size={14} />
                {speaking ? t('tale.stop') : t('tale.listen')}
              </button>
            )}
            <button type="button" className="sleep-chip" aria-pressed={save.favTale === index} onClick={() => toggleFavTale(index)}>
              <Icon name="sparkle" size={14} />
              {save.favTale === index ? t('tale.unfavorite') : t('tale.favorite')}
            </button>
          </div>
          <h3 className="story-heading">{tale.title}</h3>
          {tale.body.map((paragraph, i) => (
            <p key={i} className="story-body">
              {paragraph}
            </p>
          ))}
          <p className="story-end">{tale.end}</p>
          <div className="story-theend" aria-hidden="true">
            <span />
            <b>{t('book.theEnd')}</b>
            <span />
          </div>

          {index === TALE_COUNT && (
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
            <button type="button" className="btn btn-soft" onClick={() => openSheet({ kind: 'book' })}>
              <Icon name="book" size={16} />
              {t('book.title')}
            </button>
          </div>
        </>
      ) : (
        <p className="sheet-paragraph">{t('journal.locked', { level: chapter.unlockLevel })}</p>
      )}
    </SheetFrame>
  );
}
