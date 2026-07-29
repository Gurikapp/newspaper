<script>
  import Masthead from '$lib/components/Masthead.svelte';
  import EventsColumn from '$lib/components/EventsColumn.svelte';
  import NewsColumn from '$lib/components/NewsColumn.svelte';
  import EditorialColumn from '$lib/components/EditorialColumn.svelte';
  import CreativeColumn from '$lib/components/CreativeColumn.svelte';
  import Footer from '$lib/components/Footer.svelte';

  import { meta, events, news, editorial, creative, socialLinks } from '$lib/data/content.js';
</script>

<svelte:head>
  <title>Суета Ордена — №{meta.issueNumber}</title>
  <meta name="description" content="Газета Ордена Зелёной Ленточки, Повязанной на Сломанный Зонтик" />
</svelte:head>

<div class="page-wrapper">
  <div class="newspaper">
    <Masthead {meta} />
    <main class="columns-grid">
      <EventsColumn {events} />
      <NewsColumn {news} />
      <EditorialColumn {editorial} />
      <CreativeColumn {creative} />
    </main>
    <Footer links={socialLinks} {meta} />
  </div>
</div>

<style>
  :global(:root) {
    --paper:        #EAE4D0;
    --paper-dark:   #DDD6C0;
    --ink:          #111010;
    --ink-mid:      #2A2620;
    --ink-light:    #3E3830;
    --rule:         #9A9080;
    --rule-light:   #C4BAA4;
    --green:        #3A6347;
    --green-light:  #6B9E7A;
    --accent:       #2C2C2C;

    --font-display: 'Cheshirskiy Cat', 'Kot Leopold', serif;
    --font-body:    'CoquetteC', 'Old Comedy', 'Matreshka', serif;
    --font-sub:     'Neucha', 'Realize My Passion', 'Samba', serif;
  }

  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }

  :global(body) {
    margin: 0;
    background: #C8BFA8;
    min-height: 100vh;
  }

  .page-wrapper {
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
  }

  .newspaper {
    background: var(--paper);
    max-width: 1080px;
    width: 100%;
    padding: 2.2rem 2.8rem 2rem;
  }

  .columns-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
    margin-top: 0.6rem;
  }

  .columns-grid :global(.col) {
    padding: 0 1rem;
    border-right: 1px solid var(--rule);
  }
  .columns-grid :global(.col:first-child) { padding-left: 0; }
  .columns-grid :global(.col:last-child)  { padding-right: 0; border-right: none; }

  :global(.rubric) {
    font-family: var(--font-body);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink);
    display: block;
    margin-bottom: 0.25rem;
  }

  :global(.col-title) {
    font-family: var(--font-display);
    font-size: 1.35rem;
    font-weight: 700;
    line-height: 1.15;
    color: var(--ink);
    margin-bottom: 0.35rem;
  }

  :global(.col-rule) {
    border: none;
    border-top: 2px solid var(--ink);
    margin-bottom: 0.7rem;
  }

  :global(.body-text) {
    font-family: var(--font-body);
    font-size: 0.83rem;
    line-height: 1.65;
    color: var(--ink-mid);
    text-align: justify;
    hyphens: auto;
  }

  /* Адаптив */
  @media (max-width: 900px) {
    .columns-grid { grid-template-columns: 1fr 1fr; }
    .columns-grid :global(.col:nth-child(2)) { border-right: none; }
    .columns-grid :global(.col:nth-child(3)) {
      padding-left: 0;
      border-top: 2px solid var(--ink);
      border-right: 1px solid var(--rule);
      padding-top: 1rem; margin-top: 1rem;
    }
    .columns-grid :global(.col:nth-child(4)) {
      border-right: none;
      border-top: 2px solid var(--ink);
      padding-top: 1rem; margin-top: 1rem;
    }
  }

  @media (max-width: 580px) {
    .page-wrapper { padding: 0; }
    .newspaper { padding: 1rem; }
    .columns-grid { grid-template-columns: 1fr; }
    .columns-grid :global(.col) {
      padding: 0 !important;
      border-right: none !important;
      border-top: 1px solid var(--rule);
      padding-top: 1rem !important;
      margin-top: 1rem;
    }
    .columns-grid :global(.col:first-child) { border-top: none; margin-top: 0; padding-top: 0 !important; }
  }
</style>
