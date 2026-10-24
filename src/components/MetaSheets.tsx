import { ACHIEVEMENTS } from '../game/content/progression';
import { dailyAvailableAt, dailyReward, dailyStreakOnClaim } from '../game/engine';
import { useGame } from '../game/store';
import { formatDuration, formatNumber, makeT } from '../i18n';
import Icon from './Icon';
import SheetFrame from './SheetFrame';
import AchievementList from './AchievementList';
import { asset } from '../lib/assets';

export function DailySheet() {
  const save = useGame((s) => s.save);
  const now = useGame((s) => s.now);
  const claimDaily = useGame((s) => s.claimDaily);
  const closeSheet = useGame((s) => s.closeSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const availableAt = dailyAvailableAt(save);
  const ready = now >= availableAt;
  const comingStreak = ready ? dailyStreakOnClaim(save, now) : Math.max(1, save.daily.streak + 1);
  const reward = dailyReward(comingStreak);
  const filled = Math.min(7, save.daily.streak);

  return (
    <SheetFrame title={t('daily.title')} subtitle={t('daily.body')} className="daily-sheet">
      <div className={`daily-gift ${ready ? 'is-ready' : ''}`}>
        <span className="daily-rays" aria-hidden="true" />
        <span className="daily-orb" aria-hidden="true">
          <Icon name="gift" size={34} />
        </span>
        <span className="daily-ring" aria-hidden="true" />
      </div>

      <div className="streak-row" aria-label={t('daily.streak', { n: save.daily.streak })}>
        {Array.from({ length: 7 }, (_, i) => (
          <span key={i} className={`streak-dot ${i < filled ? 'is-filled' : ''}`}>
            <Icon name="moon" size={12} />
          </span>
        ))}
      </div>
      <p className="daily-streak-copy">{t('daily.streak', { n: save.daily.streak })}</p>

      <div className="daily-reward">
        <span>
          <Icon name="dew" size={16} />
          {formatNumber(locale, reward.dew)}
        </span>
        <span>
          <Icon name="stardust" size={15} />
          {formatNumber(locale, reward.stardust)}
        </span>
      </div>

      {ready ? (
        <button type="button" className="btn btn-primary btn-full" onClick={claimDaily}>
          <Icon name="gift" size={17} />
          {t('daily.claim')}
        </button>
      ) : (
        <>
          <button type="button" className="btn btn-soft btn-full" disabled>
            <Icon name="moon" size={17} />
            {t('daily.next', { time: formatDuration(availableAt - now, locale, t) })}
          </button>
          <button type="button" className="text-button" onClick={closeSheet}>
            {t('common.close')}
          </button>
        </>
      )}
    </SheetFrame>
  );
}

export function OfflineSheet() {
  const save = useGame((s) => s.save);
  const welcome = useGame((s) => s.welcomeBack);
  const dismiss = useGame((s) => s.dismissWelcomeBack);
  const closeSheet = useGame((s) => s.closeSheet);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const away = welcome?.awayMs ?? 0;
  const ripe = welcome?.ripe ?? 0;

  return (
    <SheetFrame title={t('title.welcomeBack')} subtitle={t('title.offlineBody')} className="offline-sheet">
      <div className="offline-art" aria-hidden="true">
        <div className="offline-moon" />
        <div className="offline-hills" />
        <span className="offline-asleep">
          <Icon name="moon" size={22} />
        </span>
      </div>
      <div className="offline-stats">
        <div>
          <span className="eyebrow">{t('title.awayFor', { time: formatDuration(away, locale, t) })}</span>
        </div>
        <p>{ripe > 0 ? t('title.offlineRipe', { count: ripe }) : t('title.offlineNone')}</p>
      </div>
      <button
        type="button"
        className="btn btn-primary btn-full"
        onClick={() => {
          dismiss();
          closeSheet();
        }}
      >
        {t('title.letsSee')}
      </button>
    </SheetFrame>
  );
}

export function AchievementsSheet() {
  const save = useGame((s) => s.save);
  const locale = save.locale ?? 'en';
  const t = makeT(locale);
  const claimed = save.achievementsClaimed.length;

  return (
    <SheetFrame title={t('journal.tabAch')} subtitle={t('journal.achClaimed', { claimed, total: ACHIEVEMENTS.length })}>
      <AchievementList />
    </SheetFrame>
  );
}

export function PrivacySheet() {
  const locale = useGame((s) => s.save.locale ?? 'en');
  const t = makeT(locale);
  return (
    <SheetFrame title={t('settings.privacy')} subtitle={t('app.by')}>
      <div className="legal-body">
        <p>{t('settings.privacyBody')}</p>
        <p className="muted">{t('settings.offlineNote')}</p>
      </div>
    </SheetFrame>
  );
}

export function CreditsSheet() {
  const locale = useGame((s) => s.save.locale ?? 'en');
  const t = makeT(locale);
  return (
    <SheetFrame title={t('settings.credits')} subtitle={t('app.by')} className="credits-sheet">
      <div className="credits-mark">
        <img
          className="credits-logo"
          src={asset('brand/nrnworld-mark.png')}
          alt="nRnWorld"
          width={116}
          height={116}
          decoding="async"
        />
      </div>
      <p className="credits-body">{t('settings.creditsBody')}</p>
      <p className="credits-signature">nRnWorld</p>
      <p className="settings-version">{t('settings.version', { version: '1.0.0' })}</p>
    </SheetFrame>
  );
}
