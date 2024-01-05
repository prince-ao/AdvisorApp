<script lang="ts">
  import { Course } from '.';
  import type { Courses } from './types';

  export let courses: Courses;
</script>

<main>
  <div class="absolute">
    {#each courses as { name, credits, }}
      <Course name={name} credits={credits} />
    {/each}
  </div>
\</main>
