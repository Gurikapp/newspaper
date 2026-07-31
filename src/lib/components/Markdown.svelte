<script>
  import { marked } from 'marked';

  export let content = '';

  $: html = marked(content);
</script>

<div class="markdown">
  {@html html}
</div>

<style>
  .markdown :global(a) {
    color: #000000;
    text-decoration: underline;
  }

  .markdown :global(a:hover) {
    color: #3e3e3e;
    text-decoration: none;
  }

  .markdown :global(p) {
  margin: 0 0 0.5rem 0;
}

.markdown :global(strong) {
  font-weight: 700;
}
</style>