(() => {
  const clock = document.getElementById('student-vote-clock');
  const ended = document.getElementById('student-vote-ended');
  if (!clock || !ended) return;

  // November 3, 2026 at 7 p.m. Mountain Standard Time.
  const deadline = Date.parse('2026-11-04T02:00:00Z');
  const units = ['days', 'hours', 'minutes', 'seconds'];
  const digits = units.map(unit => clock.querySelector(`[data-unit="${unit}"]`));
  if (digits.some(digit => !digit)) return;

  function update() {
    const remaining = Math.max(0, deadline - Date.now());
    const values = [
      Math.floor(remaining / 86400000),
      Math.floor(remaining / 3600000) % 24,
      Math.floor(remaining / 60000) % 60,
      Math.floor(remaining / 1000) % 60
    ];
    digits.forEach((digit, index) => {
      digit.textContent = String(values[index]).padStart(2, '0');
    });
    clock.hidden = remaining === 0;
    ended.hidden = remaining > 0;
    return remaining > 0;
  }

  if (update()) {
    const timer = setInterval(() => {
      if (!update()) clearInterval(timer);
    }, 1000);
  }
})();
