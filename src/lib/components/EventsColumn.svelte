<script>
  export let events;

  const typeIcons = {
    discussion: "📖",
    game: "🎲",
    creative: "🎨",
    lecture: "🎙",
    other: "📌",
  };
</script>

<section class="col">
  <span class="rubric">Анонсы встреч</span>
  <h2 class="col-title">Встречи месяца</h2>
  <hr class="col-rule" />

  <!-- Вводная цитата в стиле газеты -->
  <blockquote class="lede-quote">
    «&thinsp;Для дружбы тоже требуется некая телесная близость. Слова на экране
    монитора — как-то слишком уж пресно.&thinsp;»
  </blockquote>
  <hr class="thin-rule" />

  {#each events as event (event.id)}
    <article class="event">
      <div class="event-head">
        <span class="event-bullet">·</span>
        <span class="event-date-str"
          >{event.date}, {event.weekday}, {event.time}</span
        >
      </div>
      <h3 class="event-title">{event.title}</h3>
      <p class="event-place body-text"><em>{event.place}</em></p>
      <p class="event-desc body-text">
        {#each event.description as para}
          <p class="event-desc body-text">{@html para}</p>
        {/each}
      </p>
    </article>
    <hr class="thin-rule" />
  {/each}

  <p class="footer-note body-text">Подробности в сообществах Ордена.</p>
</section>

<style>
  :global(.event-desc a) {
    color: #000000;
  }

  :global(.event-desc a:hover) {
    color: #3e3e3e;
    text-decoration: none;
  }

  .lede-quote {
    font-family: var(--font-display);
    font-size: 0.88rem;
    font-style: italic;
    font-weight: 700;
    line-height: 1.45;
    color: var(--ink);
    text-align: justify;
    margin-bottom: 0.55rem;
  }

  .thin-rule {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 0.55rem 0;
  }

  .event {
    margin-bottom: 0.1rem;
  }

  .event-head {
    display: flex;
    align-items: baseline;
    gap: 0.3rem;
    margin-bottom: 0.15rem;
  }

  .event-bullet {
    font-size: 1.1rem;
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
  }

  .event-date-str {
    font-family: var(--font-body);
    font-size: 0.78rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.01em;
  }

  .event-title {
    font-family: var(--font-display);
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--ink);
    margin-bottom: 0.18rem;
  }

  .event-place {
    font-size: 0.75rem;
    margin-bottom: 0.2rem;
    color: var(--ink-light);
  }

  .event-desc {
    font-size: 0.8rem;
    color: var(--ink-mid);
  }

  .footer-note {
    font-size: 0.75rem;
    font-style: italic;
    color: var(--ink-light);
  }
</style>
