<script lang="ts">
  import TypedText from './TypedText.svelte';
  let { text } = $props<{ text: string }>();
</script>

<p class="openline"><TypedText {text} step={0.012} /></p>

<style>
  .openline {
    border-bottom: 1px dashed var(--hairline);
    padding: 10px 0; margin-bottom: 22px;
    font-size: 10.5px; letter-spacing: 0.3em; text-transform: uppercase;
    color: var(--ink-faint); white-space: nowrap; overflow: hidden;
  }
</style>
