<script>
  export let news;
</script>

<section class="col">
  <span class="rubric">Новости сообщества</span>
  <h2 class="col-title">Жизнь Ордена</h2>
  <hr class="col-rule" />

  {#each news as item, i (item.id)}
    <article class="news-item">
      {#if i === 0}
        <!-- Главная новость -->
        <div class="featured-date">
          <span class="bullet">·</span> {item.date}.
        </div>
      {/if}

      <h3 class="news-headline" class:featured={i === 0}>{item.headline}</h3>
      <p class="body-text">{item.body}</p>

      {#if i === 0}
        <!-- Изображение -->
        <div class="img-placeholder">
          <span class="img-emoji">🏰</span>
        </div>
      {/if}
    </article>
    {#if i < news.length - 1}
      <hr class="thin-rule" />
    {/if}
  {/each}
</section>

<style>
  .thin-rule {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 0.6rem 0;
  }

  .featured-date {
    font-family: var(--font-display);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 0.25rem;
    display: flex;
    align-items: baseline;
    gap: 0.3rem;
  }

  .bullet {
    font-size: 1.3rem;
    font-weight: 900;
    line-height: 1;
  }

  .news-headline {
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 700;
    line-height: 1.35;
    color: var(--ink);
    margin-bottom: 0.3rem;
  }

  .news-headline.featured {
    font-family: var(--font-display);
    font-size: 0.95rem;
    font-weight: 400;
    font-style: italic;
  }

  .body-text {
    font-size: 0.81rem;
    margin-bottom: 0.3rem;
  }

  .img-placeholder {
    background: var(--paper-dark);
    border: 1px solid var(--rule-light);
    height: 130px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0.5rem 0;
  }

  .img-emoji {
    font-size: 3.5rem;
    opacity: 0.4;
  }
</style>
