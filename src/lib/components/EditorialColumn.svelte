<script>
  export let editorial;
</script>

<section class="col">
  <span class="rubric">Слово Магистра</span>
  <h2 class="col-title">{editorial.title}</h2>
  <hr class="col-rule" />

  {#each editorial.text as paragraph, i}
    <p class="body-text editorial-para" class:first={i === 0}>
      {#if i === 0}
        <span class="drop-cap">{paragraph[0]}</span>{paragraph.slice(1)}
      {:else}
        {paragraph}
      {/if}
    </p>
  {/each}

  <hr class="thin-rule" />
  <p class="author-role">{editorial.role}</p>
</section>

<style>
  .thin-rule {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 0.55rem 0;
  }

  .editorial-para {
    margin-bottom: 0.55rem;
    font-size: 0.81rem;
    overflow: hidden;
  }

  .drop-cap {
    float: left;
    font-family: var(--font-display);
    font-size: 3.2rem;
    font-weight: 900;
    line-height: 0.82;
    margin: 0.1rem 0.25rem 0 0;
    color: var(--ink);
  }

  .author-role {
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-style: italic;
    color: var(--ink-light);
    line-height: 1.4;
  }
</style>
