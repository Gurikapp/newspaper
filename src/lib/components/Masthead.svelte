<script>
  export let meta;
</script>

<header class="masthead">
  <!-- Верхняя строка. Издание Дата -->
  <div class="top-bar">
    <span class="top-bar-left">{meta.edition}</span>
    <span class="top-bar-right">· {meta.date}, Выпуск №{meta.issueNumber}</span>
  </div>

  <div class="top-rule"></div>

  <!-- Главное название -->
  <div class="title-block">
    <h1 class="main-title">СУЕТА ОРДЕНА</h1>
    <p class="sub-title">З е л ё н о й &nbsp; Л е н т о ч к и , &nbsp; П о в я з а н н о й &nbsp; н а &nbsp; С л о м а н н ы й &nbsp; З о н т и к</p>
  </div>

  <div class="bottom-rule-double">
    <div class="rule-thick"></div>
    <div class="rule-thin"></div>
  </div>

  <!-- Промежуточная строчка -->
  <div class="section-bar">
    <span class="section-label-left"><em>{meta.motto}</em></span>
    <!-- <span class="section-label-right"><em>{meta.edition}</em></span> -->
  </div>
  <div class="section-rule"></div>
</header>

<style>
  .masthead {
    margin-bottom: 0.5rem;
  }

  .top-bar {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    padding: 0.3rem 0 0.3rem;
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
    font-size: clamp(2.8rem, 7vw, 5.2rem);
    font-weight: 900;
    letter-spacing: -0.01em;
    line-height: 1;
    color: var(--ink);
    margin-bottom: 0.25rem;
  }

  .sub-title {
    font-family: var(--font-sub);
    font-size: clamp(0.85rem, 2.2vw, 1.25rem);
    font-weight: 300;
    letter-spacing: 0.08em;
    color: var(--ink-mid);
    line-height: 1.3;
  }

  .bottom-rule-double {
    margin: 0.55rem 0 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .rule-thick {
    height: 3px;
    background: var(--ink);
  }

  .rule-thin {
    height: 1px;
    background: var(--ink);
  }

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

  .section-label-left em,
  .section-label-right em {
    font-style: italic;
    font-weight: 700;
  }

  .section-rule {
    border-top: 1px solid var(--ink);
  }
</style>
