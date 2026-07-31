<script>
  import { supabase } from "$lib/supabase";
  import { goto } from "$app/navigation";

  let email = "";
  let password = "";
  let message = "";
  let loading = false;

  async function login() {
    if (!email || !password) {
      message = "Введите email и пароль.";
      return;
    }

    loading = true;
    message = "";

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      message = error.message;
      loading = false;
      return;
    }

    // Успешный вход — идём в админку
    await goto("/admin", { replaceState: true });
  }

  function handleKeydown(e) {
    if (e.key === "Enter") login();
  }
</script>

<svelte:head>
  <title>Вход — Редактор «Суеты Ордена»</title>
</svelte:head>

<div class="page-wrapper">
  <div class="newspaper">
    <header class="masthead">
      <div class="top-bar">
        <span>Газета Ордена Зелёной Ленточки</span>
        <span>Доступ в редакцию</span>
      </div>
      <div class="top-rule"></div>
      <div class="title-block">
        <h1 class="main-title">РЕДАКЦИЯ</h1>
        <p class="sub-title">С у е т ы &nbsp; О р д е н а</p>
      </div>
      <div class="bottom-rule-double">
        <div class="rule-thick"></div>
        <div class="rule-thin"></div>
      </div>
      <div class="section-bar">
        <em>Вход только для уполномоченных членов Ордена</em>
      </div>
      <div class="section-rule"></div>
    </header>

    <div class="login-area">
      <div class="login-box">
        <p class="login-rubric">✒ Удостоверение личности</p>

        <div class="field-group">
          <label class="field-label" for="email">Адрес почты</label>
          <input
            id="email"
            class="field-input"
            type="email"
            bind:value={email}
            on:keydown={handleKeydown}
            placeholder="редактор@орден.рф"
            disabled={loading}
            autocomplete="email"
          />
        </div>

        <div class="field-group">
          <label class="field-label" for="password">Пароль</label>
          <input
            id="password"
            class="field-input"
            type="password"
            bind:value={password}
            on:keydown={handleKeydown}
            placeholder="•••••••••"
            disabled={loading}
            autocomplete="current-password"
          />
        </div>

        {#if message}
          <p class="error-msg">{message}</p>
        {/if}

        <button class="login-btn" on:click={login} disabled={loading}>
          {loading ? "Проверка…" : "Войти в редакцию"}
        </button>
      </div>

      <div class="deco-block">
        <div class="deco-frame">
          <span class="deco-icon">🌿</span>
        </div>
      </div>
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
    --font-display: "Cheshirskiy Cat", "Kot Leopold", serif;
    --font-body: "CoquetteC", "Old Comedy", "Matreshka", serif;
    --font-sub: "Neucha", "Realize My Passion", "Samba", serif;
  }

  :global(*) { box-sizing: border-box; margin: 0; padding: 0; }
  :global(body) { background: #c8bfa8; min-height: 100vh; }

  .page-wrapper {
    padding: 2rem 1rem;
    display: flex;
    justify-content: center;
    min-height: 100vh;
    align-items: flex-start;
  }

  .newspaper {
    background: var(--paper);
    max-width: 520px;
    width: 100%;
    padding: 2.2rem 2.8rem 2rem;
  }

  .masthead { margin-bottom: 1.5rem; }

  .top-bar {
    display: flex;
    justify-content: space-between;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 700;
    color: var(--ink);
    padding: 0.3rem 0;
  }

  .top-rule { border-top: 1.5px solid var(--ink); margin-bottom: 0.6rem; }

  .title-block { text-align: center; padding: 0.3rem 0 0.5rem; }

  .main-title {
    font-family: var(--font-display);
    font-size: clamp(2.5rem, 10vw, 3.5rem);
    font-weight: 900;
    color: var(--ink);
    line-height: 1;
    margin-bottom: 0.2rem;
  }

  .sub-title {
    font-family: var(--font-sub);
    font-size: 0.9rem;
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
    padding: 0.3rem 0 0.25rem;
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-style: italic;
    font-weight: 700;
    color: var(--ink);
    text-align: center;
  }

  .section-rule { border-top: 1px solid var(--ink); }

  .login-area { padding: 1.5rem 0 0.5rem; }

  .login-box {
    border: 1px solid var(--rule);
    padding: 1.5rem 1.5rem 1.8rem;
    background: var(--paper-dark);
  }

  .login-rubric {
    font-family: var(--font-body);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--ink-light);
    text-align: center;
    margin-bottom: 1.2rem;
  }

  .field-group { margin-bottom: 1rem; }

  .field-label {
    display: block;
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-bottom: 0.35rem;
  }

  .field-input {
    width: 100%;
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 0.5rem 0.7rem;
    outline: none;
    transition: border-color 0.15s;
  }

  .field-input:focus { border-color: var(--ink); }
  .field-input:disabled { opacity: 0.6; }

  .error-msg {
    font-family: var(--font-body);
    font-size: 0.75rem;
    color: #8b1a1a;
    margin-bottom: 0.8rem;
    font-style: italic;
    line-height: 1.4;
  }

  .login-btn {
    width: 100%;
    margin-top: 0.5rem;
    font-family: var(--font-body);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 0.7rem 1rem;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .login-btn:hover:not(:disabled) { opacity: 0.85; }
  .login-btn:disabled { opacity: 0.5; cursor: default; }

  .deco-block {
    border: 1px solid var(--rule);
    padding: 0.8rem;
    text-align: center;
    margin-top: 1.2rem;
  }

  .deco-frame {
    border: 1px solid var(--rule-light);
    padding: 0.5rem;
    display: inline-block;
    min-width: 60%;
    font-size: 1.5rem;
  }

  .deco-icon { opacity: 0.45; }

  .admin-footer { margin-top: 2rem; }

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

  @media (max-width: 580px) {
    .page-wrapper { padding: 0; }
    .newspaper { padding: 1rem; }
  }
</style>