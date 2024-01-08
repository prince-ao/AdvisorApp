<script lang="ts">
  import { onMount } from 'svelte';
  import { Course } from '.';
  import type { Courses, CourseT, CourseID } from './types';

  export let courses: Courses;
  let courseDragging: [number, number] | null = null;
  let shiftDown = false;
  let selectedCourse: CourseID | null = null;

  onMount(() => {
    document.addEventListener('keydown', (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
          shiftDown = true;
        }
    });

    document.addEventListener('keyup', (e: KeyboardEvent) => {
        if (e.key === 'Shift') {
          shiftDown = false;
        }
    })

    document.addEventListener('keypress', (e) => {
      if(e.key === 'd') {
        console.log(courses)
        console.log(selectedCourse)
        courses = courses.filter((course) => course.courseID !== selectedCourse);
        courses = courses;
      }
    })

    
  })

  function handleDrag(e: CustomEvent) {
    courseDragging = [e.detail.x, e.detail.y];
    if(shiftDown) {
      const newCourse = structuredClone(courses[courses.length - 1]);
      [newCourse.x, newCourse.y] = [e.detail.x, e.detail.y];
      newCourse.courseID = newCourse.courseID + 1;
      courses = [...courses, newCourse];
    }
  }

  function handleClick(e: CustomEvent) {
    if(JSON.stringify(courseDragging) === JSON.stringify([e.detail.x, e.detail.y])) {
      console.log(e.detail)
      if(selectedCourse === e.detail.courseID) {
        selectedCourse = null;
      } else {
        selectedCourse = e.detail.courseID;
      }
    }
    courses = courses
  }
  </script>

<main>
  <div class="absolute">
    {#each courses as course }
      <Course { course } on:drag={handleDrag} on:click={handleClick} bind:selected={selectedCourse} />
    {/each}
  </div>
</main>
