<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
    import type { CourseT } from './types';

  export let selected = false;
  export let course: CourseT;
  let { name, credits, courseID } = course;

  const dispatch = createEventDispatcher();
  let isDragging = false;
  let courseTaken = false;
  let offsetX = 0, offsetY = 0;
  let mouseX = 0, mouseY = 0;
	let divElement: HTMLButtonElement | null = null;

  $: if(isDragging) {
    emitDrag();
  } 

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      mouseX = e.x;
      mouseY = e.y;
      if(isDragging) {
        divElement!.style.left = `${mouseX - offsetX}px`;
        divElement!.style.top = `${mouseY - offsetY}px`;
      }
    })


    if(divElement) {
      divElement.style.left = `${course.x}px`;
      divElement.style.top = `${course.y}px`;
    }
  })

  function emitDrag() {
    dispatch('drag', { name, credits, courseID, x: mouseX - offsetX, y: mouseY - offsetY });
  }

  function emitClick() {
    dispatch('click', { name, credits, courseID, x: mouseX - offsetX, y: mouseY - offsetY });
  }

/* Bug with clicking new line when editing content: fix (no new lines) */
</script>

<button
  bind:this={divElement}
  on:mouseup={() => { isDragging = false }}
  on:mousedown={(e) => {
    if(divElement) {
      offsetX = e.x - divElement.offsetLeft;
      offsetY = e.y - divElement.offsetTop;

      isDragging = true;
    }
  }}
  on:click={emitClick}
  class={`flex flex-col items-center justify-center gap-4 border-2 w-[300px] h-[150px] rounded-3xl absolute cursor-grab ${selected ? 'border-amber-500' : 'border-black'} ${isDragging ? 'cursor-grabbing' : ''}`}
>
  <button 
    on:click={() => courseTaken = !courseTaken} 
    class={`rounded-full w-[25px] h-[25px] ${courseTaken ? 'bg-green-500' : 'bg-gray-300'} absolute top-[-5px] right-[-5px] cursor-pointer`}
  ></button>
  <h1 
    contenteditable
    spellcheck={false} 
    on:input={(e) => { name = e.target.innerText; }} 
    class="text-xl"
  >{name}</h1>
  <h2 
    contenteditable
    spellcheck={false} 
    on:input={(e) => { credits = Number(e.target.innerText); }} 
    class="text-lg"
  >{credits}</h2>
</button>
