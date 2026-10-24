import { ACHIEVEMENTS } from '../game/content/progression';
import { achievementProgress } from '../game/engine';
import { useGame } from '../game/store';
import { formatNumber, makeT, type DictKey } from '../i18n';
import Icon from './Icon';

export default function AchievementList() {
  const save = useGame((s) => s.save);
  const claimAchievement = useGame((s) => s.claimAchievement);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);

  return (
    <div className="achievement-list">
      {ACHIEVEMENTS.map((def) => {
        const { value, done } = achievementProgress(save, def);
        const isClaimed = save.achievementsClaimed.includes(def.id);
        const ratio = Math.min(1, value / def.target);
        return (
          <div key={def.id} className={`achievement-row ${done ? 'is-done' : ''} ${isClaimed ? 'is-claimed' : ''}`}>
            <span className="achievement-medal">
              <Icon name={isClaimed ? 'check' : done ? 'sparkle' : 'trophy'} size={17} />
            </span>
            <span className="achievement-copy">
              <span className="achievement-name">{t(`achievement.${def.id}.name` as DictKey)}</span>
              <span className="achievement-desc">{t(`achievement.${def.id}.desc` as DictKey)}</span>
              <span className="achievement-progress">
                <span className="achievement-track">
                  <span style={{ width: `${Math.round(ratio * 100)}%` }} />
                </span>
                <span className="achievement-count">
                  {t('journal.progress', {
                    value: formatNumber(locale, value),
                    target: formatNumber(locale, def.target),
                  })}
                </span>
              </span>
              {!isClaimed && (
                <span className="achievement-reward">
                  <Icon name="dew" size={11} />
                  {formatNumber(locale, def.rewardDew)}
                  {def.rewardStardust > 0 && (
                    <>
                      <Icon name="stardust" size={11} />
                      {formatNumber(locale, def.rewardStardust)}
                    </>
                  )}
                </span>
              )}
            </span>
            {isClaimed ? (
              <span className="achievement-claimed">{t('journal.claimed')}</span>
            ) : (
              <button
                type="button"
                className="mini-button achievement-claim"
                disabled={!done}
                onClick={() => claimAchievement(def.id)}
              >
                {t('journal.claim')}
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}
