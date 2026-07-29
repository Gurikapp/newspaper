<script>
  export let creative;
</script>

<section class="col">
  <span class="rubric">Творчество</span>
  <h2 class="col-title">Мастерская Ордена</h2>
  <hr class="col-rule" />

  {#each creative as item, i (item.id)}
    <article class="creative-item">
      {#if item.type === "poem"}
        <div class="item-kicker">Стихи</div>
        <h3 class="item-head">{item.title}</h3>
        <pre class="poem-text">{item.content}</pre>
        <p class="byline">✒ {item.author}</p>
      {:else if item.type === "artwork"}
        <h3 class="item-head">{item.title}</h3>
        <div class="artwork-frame">
          <span class="art-emoji">🎨</span>
        </div>
        <p class="artwork-caption body-text">{item.description}</p>
        <p class="byline">✒ {item.author}</p>
      {:else if item.type === "quote"}
        <div class="item-kicker">Цитата месяца</div>
        <div class="quote-block">
          <p class="quote-text">{item.content}</p>
          <p class="quote-src">{item.source}</p>
        </div>
        <p class="byline-small">{item.author}</p>

        <!-- Логотип? -->
        <div class="deco-label">
          <div class="deco-frame">
            <span class="deco-icon">🌿</span>
          </div>
        </div>
      {:else if item.type === "prose"}
        <div class="item-kicker">Какой-нибудь вдохновенный творческий текст</div>
        <h3 class="item-head">{item.title}</h3>
        <p class="body-text prose-text">{item.content}</p>
        <p class="byline">✒ {item.author}</p>
      {/if}
    </article>

    {#if i < creative.length - 1}
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

  .item-kicker {
    font-family: var(--font-body);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-light);
    text-align: center;
    margin-bottom: 0.2rem;
  }

  .item-head {
    font-family: var(--font-display);
    font-size: 0.98rem;
    font-weight: 700;
    line-height: 1.2;
    color: var(--ink);
    margin-bottom: 0.35rem;
  }

  .poem-text {
    font-family: var(--font-body);
    font-size: 0.79rem;
    font-style: italic;
    line-height: 1.75;
    white-space: pre-wrap;
    color: var(--ink-mid);
    background: var(--paper-dark);
    padding: 0.5rem 0.6rem;
    border-left: 2px solid var(--green);
    margin-bottom: 0.35rem;
  }

  .byline {
    font-family: var(--font-body);
    font-size: 0.69rem;
    font-style: italic;
    color: var(--ink-light);
    text-align: right;
  }

  .artwork-frame {
    border: 1px solid var(--rule);
    height: 110px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--paper-dark);
    margin-bottom: 0.35rem;
  }

  .art-emoji {
    font-size: 3rem;
    opacity: 0.3;
  }

  .artwork-caption {
    font-size: 0.75rem;
    font-style: italic;
    margin-bottom: 0.25rem;
  }

  .quote-block {
    background: var(--ink);
    color: var(--paper);
    padding: 0.8rem;
    margin-bottom: 0.35rem;
    position: relative;
  }

  .quote-block::before {
    content: "\201C";
    font-family: var(--font-display);
    font-size: 5rem;
    line-height: 0.7;
    color: var(--green);
    opacity: 0.35;
    position: absolute;
    top: 0.2rem;
    left: 0.3rem;
  }

  .quote-text {
    font-family: var(--font-sub);
    font-size: 0.85rem;
    font-style: italic;
    line-height: 1.6;
    color: var(--paper);
    margin-bottom: 0.35rem;
    position: relative;
    z-index: 1;
  }

  .quote-src {
    font-family: var(--font-body);
    font-size: 0.68rem;
    color: var(--paper-dark);
    letter-spacing: 0.04em;
  }

  .byline-small {
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-style: italic;
    color: var(--ink-light);
    text-align: center;
    margin-bottom: 0.5rem;
  }

  /* Декоративный блок-лого как в образце */
  .deco-label {
    border: 1px solid var(--rule);
    padding: 0.6rem;
    text-align: center;
    margin-top: 0.4rem;
  }

  .deco-frame {
    border: 1px solid var(--rule-light);
    padding: 0.4rem;
    display: inline-block;
    margin: 0 auto;
    min-width: 70%;
    font-size: 1.8rem;
  }

  .deco-icon {
    opacity: 0.5;
  }

  .prose-text {
    font-size: 0.8rem;
    margin-bottom: 0.3rem;
  }
</style>
