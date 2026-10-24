import { useEffect, useRef } from 'react';
import { CHAPTERS } from '../game/content/progression';
import { useGame } from '../game/store';
import { formatNumber, makeT } from '../i18n';
import { taleFor } from '../i18n/tales';
import Icon from './Icon';

const ROW = 92;
const PAD = 46;

/** Horizontal centre of node `i` in percent, swaying left and right along the trail. */
const nodeX = (i: number) => 50 + 25 * Math.sin(i * 1.15);

/** The game board: one stop per level, 1 at the bottom, each opening a finished tale. */
export default function TrailMap() {
  const save = useGame((s) => s.save);
  const openSheet = useGame((s) => s.openSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const hereRef = useRef<HTMLButtonElement>(null);
  const total = CHAPTERS.length;
  const height = PAD * 2 + ROW * (total - 1);
  const yOf = (i: number) => height - PAD - i * ROW;
  const here = Math.min(save.level, total);
  const read = save.chaptersRead.length;

  useEffect(() => {
    hereRef.current?.scrollIntoView({ block: 'center' });
  }, []);

  /** Smooth trail through the first `count` stops. */
  const curve = (count: number) =>
    Array.from({ length: count }, (_, i) => i).reduce((d, i) => {
      if (i === 0) return `M${nodeX(0).toFixed(2)} ${yOf(0)}`;
      const midY = (yOf(i - 1) + yOf(i)) / 2;
      return `${d} C${nodeX(i - 1).toFixed(2)} ${midY} ${nodeX(i).toFixed(2)} ${midY} ${nodeX(i).toFixed(2)} ${yOf(i)}`;
    }, '');

  return (
    <div className="trail">
      <div className="story-progress">
        <span>{t('book.progress', { read, total })}</span>
        <span className="story-progress-track">
          <span style={{ width: `${Math.round((read / total) * 100)}%` }} />
        </span>
      </div>
      <div className="trail-board" style={{ height }}>
        <svg className="trail-line" viewBox={`0 0 100 ${height}`} preserveAspectRatio="none" aria-hidden="true">
          <path d={curve(total)} className="trail-line-base" vectorEffect="non-scaling-stroke" />
          <path d={curve(here)} className="trail-line-done" vectorEffect="non-scaling-stroke" />
        </svg>
        {CHAPTERS.map((chapter, i) => {
          const unlocked = save.level >= chapter.unlockLevel;
          const isRead = save.chaptersRead.includes(chapter.index);
          const isHere = chapter.index === here;
          const fresh = unlocked && !isRead;
          const tale = taleFor(locale, chapter.index);
          const x = nodeX(i);
          const right = x >= 50;
          return (
            <button
              key={chapter.index}
              ref={isHere ? hereRef : undefined}
              type="button"
              className={`trail-stop ${right ? 'is-right' : 'is-left'} ${isRead ? 'is-read' : ''} ${fresh ? 'is-new' : ''} ${isHere ? 'is-here' : ''} ${unlocked ? '' : 'is-locked'}`}
              style={{ top: yOf(i), left: `${x}%` }}
              disabled={!unlocked}
              onClick={() => openSheet({ kind: 'story', index: chapter.index })}
              aria-label={unlocked ? `${t('book.level', { n: chapter.index })}: ${tale?.title ?? ''}` : t('book.locked', { n: chapter.index })}
            >
              <span className="trail-node">
                {!unlocked ? <Icon name="lock" size={15} /> : isRead ? <Icon name="check" size={17} /> : formatNumber(locale, chapter.index)}
                {isHere && <span className="trail-here" aria-hidden="true" />}
              </span>
              <span className="trail-label">
                <span className="trail-kicker">
                  {isHere ? t('book.here') : fresh ? t('book.new') : t('book.level', { n: chapter.index })}
                  {save.favTale === chapter.index ? ' ★' : ''}
                </span>
                <span className="trail-title">{unlocked && tale ? tale.title : t('book.locked', { n: chapter.index })}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
