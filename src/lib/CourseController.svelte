<script lang="ts">
  import { onMount } from 'svelte';
  import { Course } from '.';
  import type { Courses, CourseT, CourseID } from './types';

  export let courses: Courses;
  let courseDragging: [number, number] | null = null;
  let shiftDown = false;

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
      console.log('here')
      if(e.key === 'Backspace') {
        courses = courses.filter((course) => !course.selected);
        courses = courses;
        console.log(courses)
      }
    })

    
  })

  function handleDrag(e: CustomEvent) {
    courseDragging = [e.detail.x, e.detail.y];
    if(shiftDown) {
      const newCourse = structuredClone(courses[courses.length - 1]);
      [newCourse.x, newCourse.y] = [e.detail.x, e.detail.y];
      newCourse.courseID = newCourse.courseID + 1;
      newCourse.selected = false;
      courses = [...courses, newCourse];
    }
  }

  function handleClick(e: CustomEvent) {
    if(JSON.stringify(courseDragging) === JSON.stringify([e.detail.x, e.detail.y])) {
      for(let course of courses) {
        if(course.courseID === e.detail.courseID) course.selected = !course.selected;
        else course.selected = false;
      }
    }
    courses = courses
  }
  </script>

<main>
  <div class="absolute">
    {#each courses as course }
      <Course { course } on:drag={handleDrag} on:click={handleClick} bind:selected={course.selected} />
    {/each}
  </div>
</main>
