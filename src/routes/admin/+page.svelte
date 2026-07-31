<script>
  import { onMount } from "svelte";
  import { supabase } from "$lib/supabase";
  import { goto } from "$app/navigation";
  import AdminMenu from "./components/AdminMenu.svelte";
  import NewsEditor from "./components/NewsEditor.svelte";
  import EventsEditor from "./components/EventsEditor.svelte";
  import EditorialEditor from "./components/EditorialEditor.svelte";
  import CreativeEditor from "./components/CreativeEditor.svelte";

  let active = "news";
  let user = null;
  let checking = true;

  onMount(async () => {
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      goto("/admin/login");
      return;
    }
    user = data.session.user;
    checking = false;
  });

  async function logout() {
    await supabase.auth.signOut();
    goto("/admin/login");
  }
</script>

<svelte:head>
  <title>Редактор — Суета Ордена</title>
</svelte:head>

{#if checking}
  <div class="loading-screen">
    <p class="loading-text">Проверка доступа…</p>
  </div>
{:else}
  <div class="page-wrapper">
    <div class="newspaper">
      <!-- Шапка в стиле газеты -->
      <header class="admin-masthead">
        <div class="top-bar">
          <span class="top-bar-left">Газета Ордена Зелёной Ленточки</span>
          <span class="top-bar-right">Редакционная система</span>
        </div>
        <div class="top-rule"></div>
        <div class="title-block">
          <h1 class="main-title">РЕДАКТОР</h1>
          <p class="sub-title">С у е т ы &nbsp; О р д е н а</p>
        </div>
        <div class="bottom-rule-double">
          <div class="rule-thick"></div>
          <div class="rule-thin"></div>
        </div>
        <div class="section-bar">
          <span class="section-label"><em>Доступ разрешён: {user?.email}</em></span>
          <button class="logout-btn" on:click={logout}>Выйти</button>
        </div>
        <div class="section-rule"></div>
      </header>

      <!-- Основной контент -->
      <div class="admin-layout">
        <aside class="admin-sidebar">
          <AdminMenu bind:active />
        </aside>
        <main class="admin-content">
          {#if active === "news"}
            <NewsEditor />
          {:else if active === "events"}
            <EventsEditor />
          {:else if active === "editorial"}
            <EditorialEditor />
          {:else if active === "creative"}
            <CreativeEditor />
          {/if}
        </main>
      </div>

      <footer class="admin-footer">
        <div class="footer-double-rule">
          <div class="r-thick"></div>
          <div class="r-thin"></div>
        </div>
        <p class="footer-copy">© Редакция «Суеты Ордена»</p>
      </footer>
    </div>
  </div>
{/if}

<style>
  :global(:root) {
    --paper: #eae4d0;
    --paper-dark: #ddd6c0;
    --ink: #111010;
    --ink-mid: #2a2620;
    --ink-light: #3e3830;
    --rule: #9a9080;
    --rule-light: #c4baa4;
    --green: #3a6347;
    --green-light: #6b9e7a;
    --accent: #2c2c2c;
    --font-display: "Cheshirskiy Cat", "Kot Leopold", serif;
    --font-body: "CoquetteC", "Old Comedy", "Matreshka", serif;
    --font-sub: "Neucha", "Realize My Passion", "Samba", serif;
  }

  :global(*) {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :global(body) {
    background: #c8bfa8;
    min-height: 100vh;
  }

  .loading-screen {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: #c8bfa8;
  }

  .loading-text {
    font-family: var(--font-body);
    font-size: 1rem;
    color: var(--ink-mid);
    font-style: italic;
  }

  .page-wrapper {
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
  }

  .newspaper {
    background: var(--paper);
    max-width: 1200px;
    width: 100%;
    padding: 2.2rem 2.8rem 2rem;
  }

  /* Шапка */
  .admin-masthead {
    margin-bottom: 1.2rem;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.3rem 0;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: 0.02em;
  }

  .top-rule {
    border-top: 1.5px solid var(--ink);
    margin-bottom: 0.6rem;
  }

  .title-block {
    text-align: center;
    padding: 0.3rem 0 0.5rem;
  }

  .main-title {
    font-family: var(--font-display);
    font-size: clamp(2.2rem, 6vw, 4rem);
    font-weight: 900;
    line-height: 1;
    color: var(--ink);
    margin-bottom: 0.2rem;
  }

  .sub-title {
    font-family: var(--font-sub);
    font-size: clamp(0.75rem, 2vw, 1rem);
    letter-spacing: 0.08em;
    color: var(--ink-mid);
  }

  .bottom-rule-double {
    margin: 0.55rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rule-thick { height: 3px; background: var(--ink); }
  .rule-thin  { height: 1px; background: var(--ink); }

  .section-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.3rem 0 0.25rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--ink);
  }

  .section-label em {
    font-style: italic;
  }

  .section-rule {
    border-top: 1px solid var(--ink);
  }

  .logout-btn {
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    background: none;
    border: 1px solid var(--ink);
    color: var(--ink);
    padding: 0.2rem 0.6rem;
    cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }

  .logout-btn:hover {
    background: var(--ink);
    color: var(--paper);
  }

  /* Основной макет */
  .admin-layout {
    display: grid;
    grid-template-columns: 190px 1fr;
    gap: 0;
    border-top: 1px solid var(--rule);
  }

  .admin-sidebar {
    border-right: 1px solid var(--rule);
    padding-right: 1.2rem;
    padding-top: 1.2rem;
  }

  .admin-content {
    padding-left: 1.6rem;
    padding-top: 1.2rem;
    min-height: 500px;
  }

  /* Футер */
  .admin-footer {
    margin-top: 2rem;
  }

  .footer-double-rule {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 0.4rem;
  }

  .r-thick { height: 3px; background: var(--ink); }
  .r-thin  { height: 1px; background: var(--ink); }

  .footer-copy {
    font-family: var(--font-body);
    font-size: 0.65rem;
    color: var(--ink-light);
    font-style: italic;
    text-align: center;
  }

  @media (max-width: 700px) {
    .page-wrapper { padding: 0; }
    .newspaper { padding: 1rem; }
    .admin-layout { grid-template-columns: 1fr; }
    .admin-sidebar {
      border-right: none;
      border-bottom: 1px solid var(--rule);
      padding-right: 0;
      padding-bottom: 1rem;
    }
    .admin-content { padding-left: 0; }
  }
</style>
