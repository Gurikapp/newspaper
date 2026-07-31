<script>
  import { supabase } from "$lib/supabase";
  import Markdown from "$lib/components/Markdown.svelte";
  import { onMount } from "svelte";

  let editorial = null;
  let loading = true;
  let saving = false;
  let errorMsg = "";
  let statusMsg = "";
  let textarea;

  onMount(loadEditorial);

  async function loadEditorial() {
    loading = true;
    const { data, error } = await supabase
      .from("editorial")
      .select("*")
      .single();

    if (error && error.code !== "PGRST116") {
      errorMsg = error.message;
    } else {
      editorial = data || { id: null, role: "", title: "", text: "" };
    }
    loading = false;
  }

  async function save() {
    saving = true;
    statusMsg = "";

    const payload = {
      role: editorial.role,
      title: editorial.title,
      text: editorial.text,
    };

    let error;
    if (editorial.id) {
      const result = await supabase.from("editorial").update(payload).eq("id", editorial.id);
      error = result.error;
    } else {
      const result = await supabase.from("editorial").insert(payload).select();
      error = result.error;
      if (!error) editorial.id = result.data[0].id;
    }

    saving = false;
    statusMsg = error ? "❌ Ошибка: " + error.message : "✓ Сохранено";
  }

  function insertMarkdown(before, after = "") {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = editorial.text || "";
    const selected = text.substring(start, end);
    editorial.text = text.substring(0, start) + before + selected + after + text.substring(end);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length + selected.length + after.length;
      textarea.selectionEnd = textarea.selectionStart;
    });
  }
</script>

<div class="editor">
  <div class="editor-header">
    <span class="editor-rubric">Слово Магистра</span>
    <h2 class="editor-title">Обращение к Ордену</h2>
    <hr class="editor-rule" />
  </div>

  {#if loading}
    <p class="status-text">Загрузка…</p>
  {:else if errorMsg}
    <p class="error-text">{errorMsg}</p>
  {:else}
    <div class="form-grid">
      <div class="form-row">
        <div class="form-field">
          <label class="field-label" for="ed-title">Заголовок обращения</label>
          <input id="ed-title" class="field-input" bind:value={editorial.title} placeholder="Незабвенные!" />
        </div>
        <div class="form-field">
          <label class="field-label" for="ed-role">Подпись (роль Магистра)</label>
          <input id="ed-role" class="field-input" bind:value={editorial.role} placeholder="Великий Магистр Ордена" />
        </div>
      </div>

      <div class="form-field">
        <label class="field-label">Текст обращения (Markdown)</label>
        <div class="md-editor">
          <div class="md-tools">
            <button class="md-btn" title="Жирный" on:click={() => insertMarkdown("**", "**")}><b>B</b></button>
            <button class="md-btn" title="Курсив" on:click={() => insertMarkdown("*", "*")}><em>I</em></button>
            <button class="md-btn" title="Ссылка" on:click={() => insertMarkdown("[", "](https://)")}>🔗</button>
            <button class="md-btn" title="Цитата" on:click={() => insertMarkdown("> ")}>❝</button>
            <button class="md-btn" title="Абзац" on:click={() => insertMarkdown("\n\n")}>¶</button>
          </div>
          <div class="md-panels">
            <textarea
              bind:this={textarea}
              class="md-textarea"
              rows="16"
              bind:value={editorial.text}
              placeholder="Уважайте друг друга…"
            ></textarea>
            <div class="md-preview">
              <p class="preview-label">Предпросмотр</p>
              <div class="editorial-preview">
                {#if editorial.title}
                  <h2 class="prev-title">{editorial.title}</h2>
                {/if}
                <div class="prev-text">
                  <Markdown content={editorial.text || ""} />
                </div>
                {#if editorial.role}
                  <hr class="prev-rule" />
                  <p class="prev-role">{editorial.role}</p>
                {/if}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    {#if statusMsg}
      <p class="status-msg" class:error={statusMsg.startsWith("❌")}>{statusMsg}</p>
    {/if}

    <div class="form-actions">
      <button class="btn-primary" on:click={save} disabled={saving}>
        {saving ? "Сохраняем…" : "Сохранить"}
      </button>
    </div>
  {/if}
</div>

<style>
  .editor-rubric {
    font-family: var(--font-body);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ink-light);
    display: block;
    margin-bottom: 0.2rem;
  }

  .editor-title {
    font-family: var(--font-display);
    font-size: 1.4rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 0.3rem;
  }

  .editor-rule {
    border: none;
    border-top: 2px solid var(--ink);
    margin-bottom: 1rem;
  }

  .status-text {
    font-family: var(--font-body);
    font-style: italic;
    color: var(--ink-light);
    font-size: 0.85rem;
  }

  .error-text {
    color: #8b1a1a;
    font-family: var(--font-body);
    font-size: 0.85rem;
  }

  .form-grid {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }

  .form-field {
    display: flex;
    flex-direction: column;
  }

  .field-label {
    font-family: var(--font-body);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-bottom: 0.3rem;
  }

  .field-input {
    font-family: var(--font-body);
    font-size: 0.85rem;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 0.45rem 0.6rem;
    outline: none;
    width: 100%;
    transition: border-color 0.15s;
  }

  .field-input:focus { border-color: var(--ink); }

  .md-tools {
    display: flex;
    gap: 0.3rem;
    margin-bottom: 0.4rem;
  }

  .md-btn {
    width: 32px;
    height: 28px;
    border: 1px solid var(--rule);
    background: var(--paper);
    font-family: var(--font-body);
    font-size: 0.8rem;
    cursor: pointer;
    color: var(--ink);
    transition: background 0.12s;
  }

  .md-btn:hover { background: var(--paper-dark); }

  .md-panels {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }

  .md-textarea {
    font-family: monospace;
    font-size: 0.8rem;
    color: var(--ink);
    background: var(--paper);
    border: 1px solid var(--rule);
    padding: 0.6rem;
    resize: vertical;
    min-height: 280px;
    width: 100%;
    outline: none;
    line-height: 1.6;
  }

  .md-textarea:focus { border-color: var(--ink); }

  .md-preview {
    border: 1px solid var(--rule);
    padding: 0.7rem;
    background: var(--paper-dark);
    min-height: 280px;
    overflow-y: auto;
  }

  .preview-label {
    font-family: var(--font-body);
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ink-light);
    margin-bottom: 0.5rem;
  }

  .editorial-preview {
    font-family: var(--font-body);
  }

  .prev-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--ink);
    margin-bottom: 0.5rem;
  }

  .prev-text :global(.markdown p) {
    font-size: 0.8rem;
    line-height: 1.65;
    color: var(--ink-mid);
    margin-bottom: 0.5rem;
    text-align: justify;
  }

  .prev-text :global(.markdown p:first-child::first-letter) {
    float: left;
    font-family: var(--font-display);
    font-size: 2.5rem;
    font-weight: 900;
    line-height: 0.82;
    margin: 0.1rem 0.2rem 0 0;
    color: var(--ink);
  }

  .prev-rule {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 0.5rem 0;
  }

  .prev-role {
    font-family: var(--font-body);
    font-size: 0.68rem;
    font-style: italic;
    color: var(--ink-light);
  }

  .btn-primary {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 0.5rem 1.4rem;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .btn-primary:hover:not(:disabled) { opacity: 0.82; }
  .btn-primary:disabled { opacity: 0.45; cursor: default; }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    margin-top: 1.2rem;
  }

  .status-msg {
    font-family: var(--font-body);
    font-size: 0.75rem;
    color: var(--green);
    font-style: italic;
    margin-top: 0.5rem;
  }

  .status-msg.error { color: #8b1a1a; }
</style>
