import { useState } from 'react';
import Hud from '../components/Hud';
import AchievementList from '../components/AchievementList';
import Icon, { type IconName } from '../components/Icon';
import { ACHIEVEMENTS } from '../game/content/progression';
import TrailMap from '../components/TrailMap';
import { SPIRIT_ORDER } from '../game/content/spirits';
import { DAY_MS } from '../game/engine';
import { useGame } from '../game/store';
import { formatNumber, makeT, type DictKey } from '../i18n';

type Tab = 'story' | 'achievements' | 'stats';

export default function JournalScreen() {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const [tab, setTab] = useState<Tab>('story');
  const claimed = save.achievementsClaimed.length;
  const days = Math.max(1, Math.ceil((now - save.createdAt) / DAY_MS));

  const stats: { key: DictKey; value: number; icon: IconName }[] = [
    { key: 'journal.stats.harvests', value: save.stats.harvests, icon: 'leaf' },
    { key: 'journal.stats.orders', value: save.stats.ordersDone, icon: 'wish' },
    { key: 'journal.stats.spirits', value: SPIRIT_ORDER.filter((id) => save.spirits[id]?.unlocked).length, icon: 'spirit' },
    { key: 'journal.stats.bonds', value: save.stats.spiritsBonded, icon: 'sparkle' },
    { key: 'journal.stats.cropsSold', value: save.stats.cropsSold, icon: 'leaf' },
    { key: 'journal.stats.dewEarned', value: Math.round(save.stats.dewEarned), icon: 'dew' },
    { key: 'journal.stats.chapters', value: save.stats.chaptersRead, icon: 'book' },
    { key: 'journal.stats.streak', value: save.stats.dailyMaxStreak, icon: 'moon' },
    { key: 'journal.stats.rare', value: save.stats.rareHarvests, icon: 'stardust' },
    { key: 'journal.stats.days', value: days, icon: 'moon' },
    { key: 'journal.stats.level', value: save.level, icon: 'trophy' },
  ];

  return (
    <section className="page" aria-label={t('journal.title')}>
      <Hud full={false} />
      <div className="page-scroll">
        <header className="page-head">
          <span className="eyebrow">{t('app.by')}</span>
          <h1>{t('journal.title')}</h1>
          <p>{t('journal.subtitle')}</p>
        </header>

        <div className="segmented" role="tablist" aria-label={t('journal.title')}>
          <button type="button" role="tab" aria-selected={tab === 'story'} className={`segment ${tab === 'story' ? 'is-active' : ''}`} onClick={() => setTab('story')}>
            {t('journal.tabStory')}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'achievements'} className={`segment ${tab === 'achievements' ? 'is-active' : ''}`} onClick={() => setTab('achievements')}>
            {t('journal.tabAch')}
          </button>
          <button type="button" role="tab" aria-selected={tab === 'stats'} className={`segment ${tab === 'stats' ? 'is-active' : ''}`} onClick={() => setTab('stats')}>
            {t('journal.tabStats')}
          </button>
        </div>

        {tab === 'story' && (
          <>
            <TrailMap />
          </>
        )}

        {tab === 'achievements' && (
          <>
            <p className="tab-summary">{t('journal.achClaimed', { claimed, total: ACHIEVEMENTS.length })}</p>
            <AchievementList />
          </>
        )}

        {tab === 'stats' && (
          <div className="stats-grid">
            {stats.map((stat) => (
              <div className="stat-tile" key={stat.key}>
                <span className="stat-tile-icon">
                  <Icon name={stat.icon} size={16} />
                </span>
                <span className="stat-tile-value">{formatNumber(locale, stat.value)}</span>
                <span className="stat-tile-label">{t(stat.key)}</span>
              </div>
            ))}
          </div>
        )}
        <div className="page-bottom-space" />
      </div>
    </section>
  );
}
