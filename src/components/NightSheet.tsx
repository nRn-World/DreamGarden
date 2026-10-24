import { TRACK_COUNT } from '../game/audio';
import { localDateKey, moonPhaseOf, nightPlanDone, nightProgress, nightReward, previewNight, weatherOf } from '../game/engine';
import { useGame } from '../game/store';
import type { NightTaskId } from '../game/types';
import { formatNumber, makeT, type DictKey } from '../i18n';
import { shareNightCard } from '../lib/shareCard';
import Icon from './Icon';
import SheetFrame from './SheetFrame';

export default function NightSheet() {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const sleep = useGame((s) => s.sleep);
  const logSleep = useGame((s) => s.logSleep);
  const go = useGame((s) => s.go);
  const openSheet = useGame((s) => s.openSheet);
  const closeSheet = useGame((s) => s.closeSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const tasks = nightProgress(save);
  const ready = nightPlanDone(save);
  const slept = save.night.slept;
  const reward = nightReward(save);
  const current = save.nightsCleared % TRACK_COUNT;
  const track = t(`music.track.${current}` as DictKey);
  const date = save.night.date || localDateKey(now);
  const moon = moonPhaseOf(date);
  const weather = weatherOf(date);
  const today = localDateKey(now);
  const askSleep = save.nightsCleared > 0 && !save.sleepLog.some((entry) => entry.date === today);
  const recent = save.sleepLog.slice(-7);
  const good = recent.filter((entry) => entry.ok).length;

  const goTo = (id: NightTaskId) => {
    if (id === 'tale') openSheet({ kind: 'book' });
    else if (id === 'feed') go('spirits');
    else if (id === 'order') go('wishes');
    else if (id === 'breathe') openSheet({ kind: 'breathe' });
    else if (id === 'reflect') openSheet({ kind: 'reflect' });
    else {
      go('garden');
      closeSheet();
    }
  };

  const tomorrow = slept
    ? previewNight(save, now)
        .map((id) => t(`night.task.${id}` as DictKey))
        .join(' · ')
    : '';

  return (
    <SheetFrame title={t('night.title')} subtitle={slept ? t('night.restedTitle') : t('night.lead')} className="night-sheet">
      <ul className="night-facts">
        <li>
          <Icon name="moon" size={13} />
          {t(`moon.${moon}` as DictKey)}
        </li>
        <li>
          <Icon name="sparkle" size={13} />
          {t(`weather.${weather}` as DictKey)}
        </li>
        {save.nightStreak > 0 && (
          <li>
            <Icon name="check" size={13} />
            {t('night.streak', { n: save.nightStreak })} · {t('night.freezes', { n: save.nightFreezes })}
          </li>
        )}
      </ul>

      <ul className="night-tasks">
        {tasks.map((task) => (
          <li key={task.id} className={`night-task ${task.done ? 'is-done' : ''}`}>
            <span className="night-task-mark" aria-hidden="true">
              {task.done ? <Icon name="check" size={16} /> : <Icon name="moon" size={14} />}
            </span>
            <span className="night-task-copy">
              <span className="night-task-name">{t(`night.task.${task.id}` as DictKey)}</span>
              <span className="night-task-bar">
                <span style={{ width: `${(task.value / task.target) * 100}%` }} />
              </span>
            </span>
            <span className="night-task-count">
              {t('night.progress', { value: formatNumber(locale, task.value), target: formatNumber(locale, task.target) })}
            </span>
            {!task.done && !slept && (
              <button type="button" className="night-task-go" onClick={() => goTo(task.id)} aria-label={t(`night.task.${task.id}` as DictKey)}>
                <Icon name="chevron" size={15} />
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="chapter-gift">
        <Icon name="gift" size={16} />
        <span>{t('night.reward')}</span>
        <span className="chapter-gift-value">
          <Icon name="dew" size={13} />
          {formatNumber(locale, reward.dew)}
          <Icon name="stardust" size={13} />
          {formatNumber(locale, reward.stardust)}
        </span>
      </div>

      <p className="night-melody">
        <Icon name="sparkle" size={14} />
        {slept ? t('night.newTrack', { track }) : t('night.nowPlaying', { track })}
      </p>
      <p className="night-hint">{t('night.bloom')}</p>

      {slept ? (
        <>
          <p className="night-rested">{t('night.restedBody')}</p>
          {tomorrow && <p className="night-hint">{t('night.tomorrow', { tasks: tomorrow })}</p>}
          <div className="sheet-actions">
            <button
              type="button"
              className="btn btn-soft"
              onClick={() =>
                void shareNightCard(
                  save.nightsCleared,
                  t('night.shareText', { n: save.nightsCleared }),
                  save.nightStreak > 1 ? t('night.streak', { n: save.nightStreak }) : '',
                )
              }
            >
              <Icon name="upload" size={16} />
              {t('night.share')}
            </button>
          </div>
        </>
      ) : (
        <div className="sheet-actions">
          <button type="button" className="btn btn-primary" disabled={!ready} onClick={sleep}>
            <Icon name="moon" size={16} />
            {ready ? t('night.sleep') : t('night.sleepLocked')}
          </button>
        </div>
      )}

      <div className="night-tools">
        <button type="button" className="btn btn-soft" onClick={() => openSheet({ kind: 'breathe' })}>
          {t('breathe.title')}
        </button>
        <button type="button" className="btn btn-soft" onClick={() => openSheet({ kind: 'reflect' })}>
          {t('reflect.title')}
        </button>
        <button type="button" className="btn btn-soft" onClick={() => openSheet({ kind: 'herbarium' })}>
          {t('herb.title')}
        </button>
        <button type="button" className="btn btn-soft" onClick={() => openSheet({ kind: 'sleep' })}>
          {t('sleep.title')}
        </button>
      </div>

      <h4 className="sleep-label">{t('night.lullabies')}</h4>
      <div className="sleep-chips">
        {Array.from({ length: TRACK_COUNT }, (_, i) => {
          const open = save.nightsCleared >= TRACK_COUNT || i <= save.nightsCleared;
          return (
            <span
              key={i}
              className={`sleep-chip lullaby ${i === current ? 'is-on' : ''} ${open ? '' : 'is-locked'}`}
              title={open ? undefined : t('night.lullabyLocked')}
            >
              {open ? t(`music.track.${i}` as DictKey) : <Icon name="lock" size={13} />}
            </span>
          );
        })}
      </div>

      {askSleep && (
        <>
          <h4 className="sleep-label">{t('night.howSlept')}</h4>
          <div className="sleep-chips">
            <button type="button" className="sleep-chip" onClick={() => logSleep(true)}>
              {t('night.sleptWell')}
            </button>
            <button type="button" className="sleep-chip" onClick={() => logSleep(false)}>
              {t('night.sleptBadly')}
            </button>
          </div>
        </>
      )}
      {recent.length >= 3 && <p className="night-hint">{t('night.sleepTrend', { n: good, total: recent.length })}</p>}

      <p className="night-count">{t('night.clearedCount', { n: save.nightsCleared })}</p>
    </SheetFrame>
  );
}
