(function () {
  function shuffle(arr) {
    const out = [...arr];
    for (let i = out.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [out[i], out[j]] = [out[j], out[i]];
    }
    return out;
  }

  function indicateWrong(input) {
    if (!input || input.disabled) return;
    input.classList.remove('wrong');
    // restart animation
    void input.offsetWidth;
    input.classList.add('wrong');
    clearTimeout(input._wrongTimer);
    input._wrongTimer = setTimeout(() => {
      input.classList.remove('wrong');
    }, 250);
  }

  /**
   * Builds a quiz where you see a city and must type the team name.
   * Handles duplicate cities by allowing either answer in either row,
   * while ensuring each team name is only used once per city.
   */
  function initCityTeamQuiz({ teamsScriptId, listId }) {
    const el = document.getElementById(teamsScriptId);
    const list = document.getElementById(listId);
    if (!el || !list) return;

    let teams;
    try {
      teams = JSON.parse(el.textContent);
    } catch {
      list.innerHTML = '<li class="quiz-row">Could not load teams.</li>';
      return;
    }

    // Map city -> valid answers
    const teamsByCity = new Map();
    for (const { city, team } of teams) {
      if (!teamsByCity.has(city)) teamsByCity.set(city, []);
      teamsByCity.get(city).push(team);
    }

    // city -> used answers
    const claimedByCity = new Map();

    list.innerHTML = '';
    const shuffled = shuffle(teams);
    shuffled.forEach(({ city }) => {
      const li = document.createElement('li');
      li.className = 'quiz-row';
      li.innerHTML = `
        <span class="quiz-city">${city}</span>
        <input type="text" class="quiz-input" placeholder="Team name" data-city="${city.replace(/"/g, '&quot;')}" autocomplete="off">
        <button type="button" class="quiz-submit">Submit</button>
        <span class="quiz-check" aria-hidden="true"><i class="fas fa-check"></i></span>
      `;

      const input = li.querySelector('.quiz-input');
      const btn = li.querySelector('.quiz-submit');
      const check = li.querySelector('.quiz-check');

      const submit = () => {
        const rowCity = (input.dataset.city || '').trim();
        const guess = (input.value || '').trim().toLowerCase();
        if (!rowCity || !guess) return;

        const options = (teamsByCity.get(rowCity) || []).map((t) =>
          (t || '').trim().toLowerCase(),
        );
        if (!options.includes(guess)) {
          indicateWrong(input);
          return;
        }

        const claimed = claimedByCity.get(rowCity) || new Set();
        if (claimed.has(guess)) {
          indicateWrong(input);
          return;
        }
        claimed.add(guess);
        claimedByCity.set(rowCity, claimed);

        input.classList.add('correct');
        input.disabled = true;
        btn.disabled = true;
        check.classList.add('visible');
      };

      btn.addEventListener('click', submit);
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') submit();
      });

      list.appendChild(li);
    });
  }

  window.initCityTeamQuiz = initCityTeamQuiz;
})();

