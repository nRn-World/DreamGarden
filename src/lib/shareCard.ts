/** Draws a small "night cleared" card and hands it to the share sheet, or downloads it where sharing is unavailable. */
export async function shareNightCard(nights: number, line: string, streakLine: string): Promise<void> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, '#0b0a1f');
  sky.addColorStop(1, '#2a1f4d');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 90; i += 1) {
    ctx.fillStyle = `rgba(255,255,255,${0.15 + ((i * 37) % 60) / 100})`;
    ctx.beginPath();
    ctx.arc((i * 211) % 1080, (i * 389) % 900, 1 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }

  ctx.fillStyle = '#ffe2ab';
  ctx.beginPath();
  ctx.arc(540, 470, 150, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2a1f4d';
  ctx.beginPath();
  ctx.arc(600, 440, 130, 0, Math.PI * 2);
  ctx.fill();

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f7f2ff';
  ctx.font = '600 120px Fraunces, Georgia, serif';
  ctx.fillText(String(nights), 540, 790);
  ctx.font = '500 46px Outfit, system-ui, sans-serif';
  ctx.fillStyle = '#a9f0cf';
  ctx.fillText(line, 540, 880);
  if (streakLine) {
    ctx.fillStyle = '#cbb6ff';
    ctx.fillText(streakLine, 540, 950);
  }
  ctx.fillStyle = 'rgba(247,242,255,0.7)';
  ctx.font = '600 52px Fraunces, Georgia, serif';
  ctx.fillText('Dream Garden', 540, 1210);
  ctx.font = '400 32px Outfit, system-ui, sans-serif';
  ctx.fillText('By nRnWorld', 540, 1262);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) return;
  const file = new File([blob], 'dream-garden-night.png', { type: 'image/png' });
  if (navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({ files: [file], text: line });
    } catch {
      /* Closing the share sheet is not an error. */
    }
    return;
  }
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = file.name;
  link.click();
  URL.revokeObjectURL(url);
}
