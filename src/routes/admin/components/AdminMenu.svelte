<script>
  export let active = "news";

  const sections = [
    { id: "news",      label: "Новости",     icon: "📰" },
    { id: "events",    label: "Встречи",     icon: "🎲" },
    { id: "editorial", label: "Магистр",     icon: "✒" },
    { id: "creative",  label: "Творчество",  icon: "🎨" },
  ];
</script>

<nav class="admin-nav">
  <p class="nav-rubric">Разделы</p>
  <hr class="nav-rule" />
  {#each sections as section}
    <button
      class="nav-btn"
      class:active={active === section.id}
      on:click={() => (active = section.id)}
    >
      <span class="nav-icon">{section.icon}</span>
      <span class="nav-label">{section.label}</span>
      {#if active === section.id}
        <span class="nav-arrow">›</span>
      {/if}
    </button>
  {/each}
</nav>

<style>
  .admin-nav {
    display: flex;
    flex-direction: column;
    gap: 0;
  }

  .nav-rubric {
    font-family: var(--font-body);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-bottom: 0.4rem;
  }

  .nav-rule {
    border: none;
    border-top: 2px solid var(--ink);
    margin-bottom: 0.5rem;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    width: 100%;
    text-align: left;
    background: none;
    border: none;
    border-bottom: 1px solid var(--rule-light);
    padding: 0.55rem 0.3rem;
    cursor: pointer;
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--ink-mid);
    letter-spacing: 0.02em;
    transition: color 0.12s, background 0.12s;
    position: relative;
  }

  .nav-btn:hover {
    color: var(--ink);
    background: var(--paper-dark);
  }

  .nav-btn.active {
    color: var(--ink);
    background: var(--paper-dark);
  }

  .nav-icon {
    font-size: 0.95rem;
    flex-shrink: 0;
  }

  .nav-label {
    flex: 1;
  }

  .nav-arrow {
    font-size: 1rem;
    color: var(--green);
    font-weight: 900;
    margin-left: auto;
  }
</style>
