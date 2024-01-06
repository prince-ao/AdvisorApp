<script lang="ts">
  import { onMount } from 'svelte';
  import { Course } from '.';
  import type { Courses, CourseT } from './types';

  export let courses: Courses;
  let courseOn: CourseT | null = null;
  let shiftDown = false;

  onMount(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
          shiftDown = true;
/*const newCourse = structuredClone(courses[courses.length - 1]);
          [newCourse.x, newCourse.y] = [courseOn.x, courseOn.y];
          courseOn = null;
          courses = [...courses, newCourse];
console.log(courses);*/
        }
    });
    document.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
          shiftDown = false;
        }
    })
  })

  function handleDrag(e: CustomEvent) {
    if(shiftDown) {
      const newCourse = structuredClone(courses[courses.length - 1]);
      [newCourse.x, newCourse.y] = [e.detail.x, e.detail.y];
      courseOn = null;
      courses = [...courses, newCourse];
//shiftDown = false;
    }
  }
  </script>

<main>
  <div class="absolute">
    {#each courses as course }
      <Course { course } on:drag={handleDrag} />
    {/each}
  </div>
</main>
