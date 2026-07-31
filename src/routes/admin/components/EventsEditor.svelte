<script>
  import { supabase } from "$lib/supabase";
  import Markdown from "$lib/components/Markdown.svelte";
  import { onMount } from "svelte";

  let events = [];
  let loading = true;
  let saving = false;
  let errorMsg = "";
  let selectedEvent = null;
  let mode = "list";
  let textarea;
  let statusMsg = "";

  onMount(loadEvents);

  async function loadEvents() {
    loading = true;
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("position", { ascending: true });

    if (error) {
      errorMsg = error.message;
    } else {
      events = data;
    }
    loading = false;
  }

  function createEvent() {
    selectedEvent = {
      date: "", weekday: "", time: "", title: "",
      place: "", description: "", position: events.length + 1,
    };
    mode = "create";
    statusMsg = "";
  }

  function editEvent(item) {
    selectedEvent = { ...item };
    mode = "edit";
    statusMsg = "";
  }

  function cancelEdit() {
    selectedEvent = null;
    mode = "list";
    statusMsg = "";
  }

  async function saveEvent() {
    saving = true;
    statusMsg = "";
    const payload = {
      date: selectedEvent.date,
      weekday: selectedEvent.weekday,
      time: selectedEvent.time,
      title: selectedEvent.title,
      place: selectedEvent.place,
      description: selectedEvent.description,
      position: selectedEvent.position,
    };

    let error;
    if (mode === "create") {
      const result = await supabase.from("events").insert(payload).select();
      error = result.error;
      if (!error) {
        events = [...events, result.data[0]].sort((a, b) => a.position - b.position);
      }
    } else {
      const result = await supabase.from("events").update(payload).eq("id", selectedEvent.id);
      error = result.error;
      if (!error) {
        events = events.map(e => e.id === selectedEvent.id ? { ...e, ...payload } : e);
      }
    }

    saving = false;
    if (error) {
      statusMsg = "❌ Ошибка: " + error.message;
    } else {
      statusMsg = "✓ Сохранено";
      mode = "list";
      selectedEvent = null;
    }
  }

  async function deleteEvent(id) {
    if (!confirm("Удалить эту встречу?")) return;
    const { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      alert(error.message);
    } else {
      events = events.filter(e => e.id !== id);
    }
  }

  function insertMarkdown(before, after = "") {
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = selectedEvent.description || "";
    const selected = text.substring(start, end);
    selectedEvent.description = text.substring(0, start) + before + selected + after + text.substring(end);
    setTimeout(() => {
      textarea.focus();
      textarea.selectionStart = start + before.length + selected.length + after.length;
      textarea.selectionEnd = textarea.selectionStart;
    });
  }
</script>

<div class="editor">
  <div class="editor-header">
    <span class="editor-rubric">Анонсы встреч</span>
    <h2 class="editor-title">Встречи Ордена</h2>
    <hr class="editor-rule" />
  </div>

  {#if loading}
    <p class="status-text">Загрузка…</p>
  {:else if errorMsg}
    <p class="error-text">{errorMsg}</p>
  {:else if mode === "list"}
    <button class="btn-primary" on:click={createEvent}>+ Новая встреча</button>

    {#if statusMsg}
      <p class="status-msg">{statusMsg}</p>
    {/if}

    {#if events.length === 0}
      <p class="empty-text">Встреч пока нет.</p>
    {:else}
      <div class="item-list">
        {#each events as item}
          <div class="list-item">
            <div class="list-item-info">
              <span class="list-item-pos">#{item.position}</span>
              <div>
                <p class="list-item-title">{item.title}</p>
                <p class="list-item-meta">{item.date}{item.weekday ? ", " + item.weekday : ""}{item.time ? ", " + item.time : ""}</p>
                {#if item.place}<p class="list-item-meta">{item.place}</p>{/if}
              </div>
            </div>
            <div class="list-item-actions">
              <button class="btn-secondary" on:click={() => editEvent(item)}>Редактировать</button>
              <button class="btn-danger" on:click={() => deleteEvent(item.id)}>Удалить</button>
            </div>
          </div>
        {/each}
      </div>
    {/if}

  {:else}
    <div class="form-header">
      <h3 class="form-title">{mode === "create" ? "Новая встреча" : "Редактирование встречи"}</h3>
      <button class="btn-ghost" on:click={cancelEdit}>← Назад</button>
    </div>
    <hr class="thin-rule" />

    <div class="form-grid">
      <div class="form-field">
        <label class="field-label" for="ev-title">Название встречи</label>
        <input id="ev-title" class="field-input" bind:value={selectedEvent.title} placeholder="Ежемесячная встреча Ордена…" />
      </div>

      <div class="form-row-3">
        <div class="form-field">
          <label class="field-label" for="ev-date">Дата</label>
          <input id="ev-date" class="field-input" bind:value={selectedEvent.date} placeholder="11 июля" />
        </div>
        <div class="form-field">
          <label class="field-label" for="ev-weekday">День недели</label>
          <input id="ev-weekday" class="field-input" bind:value={selectedEvent.weekday} placeholder="суббота" />
        </div>
        <div class="form-field">
          <label class="field-label" for="ev-time">Время</label>
          <input id="ev-time" class="field-input" bind:value={selectedEvent.time} placeholder="19:00" />
        </div>
      </div>

      <div class="form-row">
        <div class="form-field">
          <label class="field-label" for="ev-place">Место</label>
          <input id="ev-place" class="field-input" bind:value={selectedEvent.place} placeholder="Бар «Бобёр», ул. Октябрьская…" />
        </div>
        <div class="form-field" style="max-width: 120px">
          <label class="field-label" for="ev-pos">Порядок</label>
          <input id="ev-pos" class="field-input" type="number" bind:value={selectedEvent.position} min="1" />
        </div>
      </div>

      <div class="form-field">
        <label class="field-label">Описание (Markdown)</label>
        <div class="md-editor">
          <div class="md-tools">
            <button class="md-btn" title="Жирный" on:click={() => insertMarkdown("**", "**")}><b>B</b></button>
            <button class="md-btn" title="Курсив" on:click={() => insertMarkdown("*", "*")}><em>I</em></button>
            <button class="md-btn" title="Ссылка" on:click={() => insertMarkdown("[", "](https://)")}>🔗</button>
            <button class="md-btn" title="Цитата" on:click={() => insertMarkdown("> ")}>❝</button>
            <button class="md-btn" title="Список" on:click={() => insertMarkdown("- ")}>·</button>
          </div>
          <div class="md-panels">
            <textarea
              bind:this={textarea}
              class="md-textarea"
              rows="12"
              bind:value={selectedEvent.description}
              placeholder="Описание встречи…"
            ></textarea>
            <div class="md-preview">
              <p class="preview-label">Предпросмотр</p>
              <Markdown content={selectedEvent.description || ""} />
            </div>
          </div>
        </div>
      </div>
    </div>

    {#if statusMsg}
      <p class="status-msg" class:error={statusMsg.startsWith("❌")}>{statusMsg}</p>
    {/if}

    <div class="form-actions">
      <button class="btn-ghost" on:click={cancelEdit}>Отмена</button>
      <button class="btn-primary" on:click={saveEvent} disabled={saving}>
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
  }

  .list-item-meta {
    font-family: var(--font-body);
    font-size: 0.68rem;
    color: var(--ink-light);
    font-style: italic;
  }

  .list-item-actions {
    display: flex;
    gap: 0.4rem;
    flex-shrink: 0;
  }

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
    grid-template-columns: 1fr auto;
    gap: 0.8rem;
    align-items: end;
  }

  .form-row-3 {
    display: grid;
    grid-template-columns: 1fr 1fr 100px;
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
    min-height: 220px;
    width: 100%;
    outline: none;
    line-height: 1.6;
  }

  .md-textarea:focus { border-color: var(--ink); }

  .md-preview {
    border: 1px solid var(--rule);
    padding: 0.7rem;
    background: var(--paper-dark);
    min-height: 220px;
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
