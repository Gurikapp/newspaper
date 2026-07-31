<script>
  import { supabase } from "$lib/supabase";
  import Markdown from "$lib/components/Markdown.svelte";
  import { onMount } from "svelte";

  let items = [];
  let loading = true;
  let saving = false;
  let errorMsg = "";
  let statusMsg = "";
  let mode = "list"; // list | edit | create
  let selected = null;
  let textarea;
  let fileInput;
  let uploadProgress = "";

  const TYPES = [
    { value: "poem",    label: "Стихи" },
    { value: "artwork", label: "Изображение" },
    { value: "quote",   label: "Цитата" },
    { value: "prose",   label: "Проза" },
  ];

  onMount(loadItems);

  async function loadItems() {
    loading = true;
    const { data, error } = await supabase
      .from("creative")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      errorMsg = error.message;
    } else {
      items = data;
    }
    loading = false;
  }

  function createItem() {
    selected = {
      type: "poem", title: "", author: "", content: "",
      image_url: "", image_alt: "", source: "",
      position: items.length + 1,
    };
    mode = "create";
    statusMsg = "";
  }

  function editItem(item) {
    selected = { ...item };
    mode = "edit";
    statusMsg = "";
  }

  function cancelEdit() {
    selected = null;
    mode = "list";
    statusMsg = "";
    uploadProgress = "";
  }

  async function uploadImage(e) {
    const file = e.target.files[0];
    if (!file) return;

    uploadProgress = "Загрузка…";
    const ext = file.name.split(".").pop();
    const fileName = `creative/${Date.now()}.${ext}`;

    const { data, error } = await supabase.storage
      .from("images")
      .upload(fileName, file, { upsert: true });

    if (error) {
      uploadProgress = "❌ " + error.message;
      return;
    }

    const { data: urlData } = supabase.storage.from("images").getPublicUrl(fileName);
    selected.image_url = urlData.publicUrl;
    uploadProgress = "✓ Загружено";
  }

  async function removeImage() {
    selected.image_url = "";
    selected.image_alt = "";
    uploadProgress = "";
  }

  async function saveItem() {
    saving = true;
    statusMsg = "";

    const payload = {
      type: selected.type,
      title: selected.title,
      author: selected.author,
      content: selected.content,
      image_url: selected.image_url,
      image_alt: selected.image_alt,
      source: selected.source,
      position: selected.position,
    };

    let error;
    if (mode === "create") {
      const result = await supabase.from("creative").insert(payload).select();
      error = result.error;
      if (!error) {
        items = [...items, result.data[0]].sort((a, b) => a.position - b.position);
      }
    } else {
      const result = await supabase.from("creative").update(payload).eq("id", selected.id);
      error = result.error;
      if (!error) {
        items = items.map(i => i.id === selected.id ? { ...i, ...payload } : i);
      }
    }

    saving = false;
    if (error) {
      statusMsg = "❌ Ошибка: " + error.message;
    } else {
      statusMsg = "✓ Сохранено";
      mode = "list";
      selected = null;
    }
  }

  async function deleteItem(id) {
    if (!confirm("Удалить этот материал?")) return;
    const { error } = await supabase.from("creative").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      items = items.filter(i => i.id !== id);
    }
  }

  function insertMarkdown(before, after = "") {
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = selected.content || "";
    const sel = text.substring(start, end);
    selected.content = text.substring(0, start) + before + sel + after + text.substring(end);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length + sel.length + after.length;
      textarea.selectionEnd = textarea.selectionStart;
    });
  }

  function typeLabel(t) {
    return TYPES.find(x => x.value === t)?.label ?? t;
  }
</script>

<div class="editor">
  <div class="editor-header">
    <span class="editor-rubric">Мастерская Ордена</span>
    <h2 class="editor-title">Творчество</h2>
    <hr class="editor-rule" />
  </div>

  {#if loading}
    <p class="status-text">Загрузка…</p>
  {:else if errorMsg}
    <p class="error-text">{errorMsg}</p>
  {:else if mode === "list"}
    <button class="btn-primary" on:click={createItem}>+ Новый материал</button>

    {#if statusMsg}
      <p class="status-msg">{statusMsg}</p>
    {/if}

    {#if items.length === 0}
      <p class="empty-text">Материалов пока нет.</p>
    {:else}
      <div class="item-list">
        {#each items as item}
          <div class="list-item">
            <div class="list-item-info">
              <span class="list-item-pos">#{item.position}</span>
              <div>
                <p class="list-item-title">
                  <span class="type-tag">{typeLabel(item.type)}</span>
                  {item.title || item.content?.slice(0, 40) || "—"}
                </p>
                {#if item.author}<p class="list-item-meta">✒ {item.author}</p>{/if}
              </div>
            </div>
            <div class="list-item-actions">
              <button class="btn-secondary" on:click={() => editItem(item)}>Редактировать</button>
              <button class="btn-danger" on:click={() => deleteItem(item.id)}>Удалить</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

  {:else}
    <div class="form-header">
      <h3 class="form-title">{mode === "create" ? "Новый материал" : "Редактирование"}</h3>
      <button class="btn-ghost" on:click={cancelEdit}>← Назад</button>
    </div>
    <hr class="thin-rule" />

    <div class="form-grid">
      <!-- Тип и порядок -->
      <div class="form-row">
        <div class="form-field">
          <label class="field-label" for="cr-type">Тип</label>
          <select id="cr-type" class="field-input field-select" bind:value={selected.type}>
            {#each TYPES as t}
              <option value={t.value}>{t.label}</option>
            {/each}
          </select>
        </div>
        <div class="form-field" style="max-width: 110px">
          <label class="field-label" for="cr-pos">Порядок</label>
          <input id="cr-pos" class="field-input" type="number" bind:value={selected.position} min="1" />
        </div>
      </div>

      <!-- Заголовок и автор -->
      <div class="form-row">
        <div class="form-field">
          <label class="field-label" for="cr-title">Заголовок <span class="opt">(необязательно)</span></label>
          <input id="cr-title" class="field-input" bind:value={selected.title} placeholder="Заголовок произведения…" />
        </div>
        <div class="form-field">
          <label class="field-label" for="cr-author">Автор <span class="opt">(необязательно)</span></label>
          <input id="cr-author" class="field-input" bind:value={selected.author} placeholder="Имя или псевдоним…" />
        </div>
      </div>

      <!-- Источник — только для цитаты -->
      {#if selected.type === "quote"}
        <div class="form-field">
          <label class="field-label" for="cr-source">Источник цитаты</label>
          <input id="cr-source" class="field-input" bind:value={selected.source} placeholder="— Андэ Пу" />
        </div>
      {/if}

      <!-- Изображение — только для artwork -->
      {#if selected.type === "artwork"}
        <div class="form-field">
          <label class="field-label">Изображение</label>
          {#if selected.image_url}
            <div class="img-preview">
              <img src={selected.image_url} alt={selected.image_alt || "Изображение"} />
              <button class="btn-danger img-remove" on:click={removeImage}>Удалить изображение</button>
            </div>
            <div class="form-field" style="margin-top: 0.6rem">
              <label class="field-label" for="cr-alt">Альтернативный текст</label>
              <input id="cr-alt" class="field-input" bind:value={selected.image_alt} placeholder="Описание изображения для доступности" />
            </div>
          {:else}
            <div class="upload-zone" on:click={() => fileInput.click()} role="button" tabindex="0"
              on:keydown={e => e.key === "Enter" && fileInput.click()}>
              <span class="upload-icon">🖼</span>
              <span class="upload-label">Нажмите, чтобы загрузить изображение</span>
              <span class="upload-hint">JPG, PNG, WebP, GIF</span>
              {#if uploadProgress}
                <span class="upload-progress">{uploadProgress}</span>
              {/if}
            </div>
            <input
              bind:this={fileInput}
              type="file"
              accept="image/*"
              class="hidden-input"
              on:change={uploadImage}
            />
            <p class="upload-note">
              Изображение загружается в Supabase Storage (bucket «images»).
              Убедитесь, что bucket существует и открыт для публичного доступа.
            </p>
          {/if}
        </div>
      {/if}

      <!-- Текст -->
      {#if selected.type !== "artwork" || true}
        <div class="form-field">
          <label class="field-label">
            {#if selected.type === "poem"}Текст стихотворения{:else if selected.type === "quote"}Текст цитаты{:else if selected.type === "artwork"}Подпись к изображению <span class="opt">(необязательно)</span>{:else}Текст (Markdown){/if}
          </label>

          {#if selected.type === "prose"}
            <!-- Prose: markdown editor с превью -->
            <div class="md-editor">
              <div class="md-tools">
                <button class="md-btn" on:click={() => insertMarkdown("**", "**")}><b>B</b></button>
                <button class="md-btn" on:click={() => insertMarkdown("*", "*")}><em>I</em></button>
                <button class="md-btn" on:click={() => insertMarkdown("[", "](https://)")}>🔗</button>
                <button class="md-btn" on:click={() => insertMarkdown("> ")}>❝</button>
                <button class="md-btn" on:click={() => insertMarkdown("## ")}>H</button>
              </div>
              <div class="md-panels">
                <textarea
                  bind:this={textarea}
                  class="md-textarea"
                  rows="12"
                  bind:value={selected.content}
                  placeholder="Текст произведения…"
                ></textarea>
                <div class="md-preview">
                  <p class="preview-label">Предпросмотр</p>
                  <Markdown content={selected.content || ""} />
                </div>
              </div>
            </div>
          {:else if selected.type === "poem"}
            <!-- Poem: plain textarea, сохраняет переносы -->
            <textarea
              class="md-textarea poem-textarea"
              rows="14"
              bind:value={selected.content}
              placeholder={"Строка первая,\nСтрока вторая…"}
            ></textarea>
          {:else}
            <!-- Quote / artwork caption -->
            <textarea
              class="md-textarea"
              rows={selected.type === "quote" ? 4 : 3}
              bind:value={selected.content}
              placeholder={selected.type === "quote" ? "Текст цитаты…" : "Подпись к изображению…"}
            ></textarea>
          {/if}
        </div>
      {/if}
    </div>

    {#if statusMsg}
      <p class="status-msg" class:error={statusMsg.startsWith("❌")}>{statusMsg}</p>
    {/if}

    <div class="form-actions">
      <button class="btn-ghost" on:click={cancelEdit}>Отмена</button>
      <button class="btn-primary" on:click={saveItem} disabled={saving}>
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

  .thin-rule {
    border: none;
    border-top: 1px solid var(--rule);
    margin: 0.7rem 0 1rem;
  }

  .status-text, .empty-text {
    font-family: var(--font-body);
    font-style: italic;
    color: var(--ink-light);
    font-size: 0.85rem;
    margin-top: 0.5rem;
  }

  .error-text {
    color: #8b1a1a;
    font-family: var(--font-body);
    font-size: 0.85rem;
  }

  .item-list {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
  }

  .list-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--rule-light);
    gap: 1rem;
  }

  .list-item-info {
    display: flex;
    align-items: flex-start;
    gap: 0.7rem;
    flex: 1;
    min-width: 0;
  }

  .list-item-pos {
    font-family: var(--font-body);
    font-size: 0.65rem;
    color: var(--rule);
    font-weight: 700;
    flex-shrink: 0;
    margin-top: 0.15rem;
  }

  .list-item-title {
    font-family: var(--font-body);
    font-size: 0.83rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.3;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .type-tag {
    display: inline-block;
    font-size: 0.6rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--paper);
    background: var(--ink-light);
    padding: 0.05rem 0.35rem;
    margin-right: 0.4rem;
    vertical-align: middle;
  }

  .list-item-meta {
    font-family: var(--font-body);
    font-size: 0.68rem;
    color: var(--ink-light);
    font-style: italic;
    margin-top: 0.1rem;
  }

  .list-item-actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

  /* Форма */
  .form-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 0.3rem;
  }

  .form-title {
    font-family: var(--font-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--ink);
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

  .opt {
    font-weight: 400;
    letter-spacing: 0;
    text-transform: none;
    color: var(--rule);
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

  .field-select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239a9080'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.6rem center;
    padding-right: 1.8rem;
    cursor: pointer;
  }

  /* Загрузка картинки */
  .upload-zone {
    border: 2px dashed var(--rule);
    padding: 1.8rem 1rem;
    text-align: center;
    cursor: pointer;
    background: var(--paper-dark);
    transition: border-color 0.15s, background 0.15s;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3rem;
  }

  .upload-zone:hover {
    border-color: var(--ink);
    background: var(--paper);
  }

  .upload-icon { font-size: 2rem; opacity: 0.5; }

  .upload-label {
    font-family: var(--font-body);
    font-size: 0.82rem;
    font-weight: 700;
    color: var(--ink-mid);
  }

  .upload-hint {
    font-family: var(--font-body);
    font-size: 0.68rem;
    color: var(--ink-light);
  }

  .upload-progress {
    font-family: var(--font-body);
    font-size: 0.75rem;
    color: var(--green);
    font-style: italic;
  }

  .hidden-input { display: none; }

  .upload-note {
    font-family: var(--font-body);
    font-size: 0.65rem;
    color: var(--ink-light);
    font-style: italic;
    margin-top: 0.4rem;
    line-height: 1.5;
  }

  .img-preview {
    border: 1px solid var(--rule);
    padding: 0.5rem;
    background: var(--paper-dark);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .img-preview img {
    max-width: 100%;
    max-height: 250px;
    object-fit: contain;
    border: 1px solid var(--rule-light);
  }

  .img-remove {
    font-size: 0.7rem;
  }

  /* Markdown */
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
    min-height: 180px;
    width: 100%;
    outline: none;
    line-height: 1.6;
  }

  .md-textarea:focus { border-color: var(--ink); }

  .poem-textarea {
    font-family: var(--font-body);
    font-style: italic;
    line-height: 1.9;
    font-size: 0.82rem;
    min-height: 220px;
  }

  .md-preview {
    border: 1px solid var(--rule);
    padding: 0.7rem;
    background: var(--paper-dark);
    min-height: 180px;
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

  .md-preview :global(.markdown) {
    font-family: var(--font-body);
    font-size: 0.82rem;
    line-height: 1.65;
    color: var(--ink-mid);
  }

  /* Кнопки */
  .btn-primary {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    background: var(--ink);
    color: var(--paper);
    border: none;
    padding: 0.5rem 1.1rem;
    cursor: pointer;
    transition: opacity 0.15s;
  }

  .btn-primary:hover:not(:disabled) { opacity: 0.82; }
  .btn-primary:disabled { opacity: 0.45; cursor: default; }

  .btn-secondary {
    font-family: var(--font-body);
    font-size: 0.72rem;
    font-weight: 700;
    background: none;
    border: 1px solid var(--rule);
    color: var(--ink-mid);
    padding: 0.3rem 0.7rem;
    cursor: pointer;
    transition: border-color 0.12s, color 0.12s;
  }

  .btn-secondary:hover { border-color: var(--ink); color: var(--ink); }

  .btn-danger {
    font-family: var(--font-body);
    font-size: 0.72rem;
    background: none;
    border: 1px solid #c4a0a0;
    color: #8b3333;
    padding: 0.3rem 0.7rem;
    cursor: pointer;
    transition: background 0.12s;
  }

  .btn-danger:hover { background: #f5eded; }

  .btn-ghost {
    font-family: var(--font-body);
    font-size: 0.75rem;
    font-weight: 700;
    background: none;
    border: none;
    color: var(--ink-light);
    cursor: pointer;
    padding: 0.4rem 0;
    text-decoration: underline;
    text-underline-offset: 2px;
  }

  .btn-ghost:hover { color: var(--ink); }

  .form-actions {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 1rem;
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
