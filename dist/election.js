// Hide the notice after Election Day in Colorado, independent of visitor timezone.
(() => {
  const notice = document.getElementById('election-banner');
  if (!notice) return;

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Denver', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(new Date());
  const date = Object.fromEntries(parts.map(part => [part.type, part.value]));
  notice.hidden = Number(`${date.year}${date.month}${date.day}`) > 20261103;
})();
