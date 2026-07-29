<script>
  export let links;
  export let meta;
</script>

<footer class="newspaper-footer">
  <div class="footer-double-rule">
    <div class="r-thick"></div>
    <div class="r-thin"></div>
  </div>

  <div class="footer-inner">
    <span class="footer-copy">
      © {meta.date} · «Суета Ордена» · Выпуск №{meta.issueNumber}
    </span>

    <nav class="footer-links">
      {#each links as link}
        <a href={link.url} target="_blank" rel="noopener noreferrer" class="footer-link">
          {link.label}
        </a>
      {/each}
    </nav>
  </div>
</footer>

<style>
  .newspaper-footer { margin-top: 1.5rem; }

  .footer-double-rule {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 0.45rem;
  }

  .r-thick { height: 3px; background: var(--ink); }
  .r-thin  { height: 1px; background: var(--ink); }

  .footer-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 0.5rem;
    padding: 0.1rem 0;
  }

  .footer-copy {
    font-family: var(--font-body);
    font-size: 0.65rem;
    color: var(--ink-light);
    font-style: italic;
  }

  .footer-links {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
  }

  .footer-link {
    font-family: var(--font-body);
    font-size: 0.7rem;
    font-weight: 700;
    color: var(--ink);
    text-decoration: none;
    letter-spacing: 0.03em;
    border-bottom: 1px solid var(--rule);
    padding-bottom: 1px;
    transition: border-color 0.15s;
  }

  .footer-link:hover {
    border-color: var(--ink);
  }
</style>
