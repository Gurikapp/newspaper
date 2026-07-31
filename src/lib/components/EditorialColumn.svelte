<script>
  import Markdown from "./Markdown.svelte";
  export let editorial;
</script>

<section class="col">
  <span class="rubric">Слово Магистра</span>
  <h2 class="col-title">{editorial.title}</h2>
  <hr class="col-rule" />

  <div class="editorial-text body-text">
    <Markdown content={editorial.text} />
  </div>

  <hr class="thin-rule" />
  <p class="author-role">{editorial.role}</p>
</section>

<style>
.thin-rule {
  border: none;
  border-top: 1px solid var(--rule);
  margin: 0.55rem 0;
}

.editorial-text :global(p) {
  margin-bottom: 0.55rem;
  font-size: 0.81rem;
  overflow: hidden;
}

.editorial-text :global(p:first-child::first-letter) {
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
