import { useState } from 'react';
import { useGame } from '../game/store';
import { makeT } from '../i18n';
import SheetFrame from './SheetFrame';

type Kind = 'thanks' | 'worry';

export default function ReflectSheet() {
  const save = useGame((s) => s.save);
  const reflect = useGame((s) => s.reflect);
  const t = makeT(save.locale ?? 'en');
  const [kind, setKind] = useState<Kind>('thanks');
  const [text, setText] = useState('');
  const [result, setResult] = useState<{ kind: Kind; text: string } | null>(null);

  const submit = () => {
    if (!text.trim()) return;
    reflect(kind, text);
    setResult({ kind, text: text.trim() });
    setText('');
  };

  return (
    <SheetFrame title={t('reflect.title')} subtitle={t('reflect.lead')} className="reflect-sheet">
      {result ? (
        <div className="reflect-result">
          <p className={`reflect-line ${result.kind === 'worry' ? 'is-fading' : 'is-growing'}`}>{result.text}</p>
          <p className="reflect-note">{result.kind === 'thanks' ? t('reflect.planted') : t('reflect.released')}</p>
          <div className="sheet-actions">
            <button type="button" className="btn btn-soft" onClick={() => setResult(null)}>
              {t('common.back')}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="sleep-chips" role="radiogroup" aria-label={t('reflect.title')}>
            {(['thanks', 'worry'] as Kind[]).map((k) => (
              <button
                key={k}
                type="button"
                role="radio"
                aria-checked={kind === k}
                className={`sleep-chip ${kind === k ? 'is-on' : ''}`}
                onClick={() => setKind(k)}
              >
                {t(k === 'thanks' ? 'reflect.thanks' : 'reflect.worry')}
              </button>
            ))}
          </div>
          <textarea
            className="reflect-input"
            value={text}
            maxLength={140}
            rows={3}
            placeholder={t('reflect.placeholder')}
            onChange={(event) => setText(event.target.value)}
          />
          <div className="sheet-actions">
            <button type="button" className="btn btn-primary" disabled={!text.trim()} onClick={submit}>
              {t(kind === 'thanks' ? 'reflect.plant' : 'reflect.release')}
            </button>
          </div>
          <p className="night-count">{t('reflect.past', { n: save.gratitude.length })}</p>
        </>
      )}
    </SheetFrame>
  );
}
