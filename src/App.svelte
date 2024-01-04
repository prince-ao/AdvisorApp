<script lang="ts">
  import './app.css';
  import { onMount } from 'svelte';

  let mouseHold = false;
	let divElement: HTMLDivElement | null = null;

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      if(mouseHold){
        let mouseX = e.clientX;
        let mouseY = e.clientY;

        if(divElement) {
          divElement.style.left = `${mouseX - 50}px`;
          divElement.style.top = `${mouseY - 50}px`;
        } 
      }
    })
  })
</script>

<main>
  <div bind:this={divElement} on:mouseup={() => {mouseHold = false}} on:mousedown={() => {mouseHold = true}} role="button" tabindex="0" class="bg-blue-500 w-[100px] h-[100px] rounded-full absolute cursor-pointer cursor-grab">
  </div>
</main>
