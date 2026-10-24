import { TRACK_COUNT } from '../game/audio';
import { nightPlanDone, nightProgress, nightReward } from '../game/engine';
import { useGame } from '../game/store';
import type { NightTaskId } from '../game/types';
import { formatNumber, makeT, type DictKey } from '../i18n';
import Icon from './Icon';
import SheetFrame from './SheetFrame';

export default function NightSheet() {
  const save = useGame((s) => s.save);
  const sleep = useGame((s) => s.sleep);
  const go = useGame((s) => s.go);
  const openSheet = useGame((s) => s.openSheet);
  const closeSheet = useGame((s) => s.closeSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const tasks = nightProgress(save);
  const ready = nightPlanDone(save);
  const slept = save.night.slept;
  const reward = nightReward(save);
  const track = t(`music.track.${save.nightsCleared % TRACK_COUNT}` as DictKey);

  const goTo = (id: NightTaskId) => {
    if (id === 'tale') openSheet({ kind: 'book' });
    else if (id === 'feed') go('spirits');
    else if (id === 'order') go('wishes');
    else {
      go('garden');
      closeSheet();
    }
  };

  return (
    <SheetFrame title={t('night.title')} subtitle={slept ? t('night.restedTitle') : t('night.lead')} className="night-sheet">
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

      {slept ? (
        <p className="night-rested">{t('night.restedBody')}</p>
      ) : (
        <div className="sheet-actions">
          <button type="button" className="btn btn-primary" disabled={!ready} onClick={sleep}>
            <Icon name="moon" size={16} />
            {ready ? t('night.sleep') : t('night.sleepLocked')}
          </button>
        </div>
      )}
      <div className="sheet-actions">
        <button type="button" className="btn btn-soft" onClick={() => openSheet({ kind: 'sleep' })}>
          <Icon name="sound" size={16} />
          {t('sleep.title')}
        </button>
      </div>
      <p className="night-count">{t('night.clearedCount', { n: save.nightsCleared })}</p>
    </SheetFrame>
  );
}
