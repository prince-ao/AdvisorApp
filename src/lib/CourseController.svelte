<script lang="ts">
  import { onMount } from 'svelte';
  import { Course } from '.';
  import type { CourseT, CourseID } from './types';
  import { courses } from './courseStore';
  import { getCourseByCourseID } from './utils/query';
  import { checkCollision, resolveCollision } from './utils/collision';

  let courseDragging: [number, number] | null = null;
  let shiftDown = false;
  let selectedCourse: CourseID | null = null;
  let southStart = [0, 0], southEnd = [0, 0];
  let currentDragging: CourseID | null = null
  let drag = {
    south: [false, false],
    north: [false, false],
    east: [false, false],
    west: [false, false],
  }
  let internalLock = false;

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      if(drag.south[1]) {
        southEnd = [e.x, e.y];
      }
    })

    document.addEventListener('mouseup', (e) => {
      southEnd = [0, 0] 
      southStart = [0, 0]
      drag.south = [false, false];
      currentDragging = null;
      internalLock = false;
    })

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
        $courses = $courses.filter((course) => course.courseID !== selectedCourse);
        $courses = $courses;
      }
    })

    setInterval(() => {
      handleCollisions();
    }, 33);

    
  })

  function handleDrag(e: CustomEvent) {
    courseDragging = [e.detail.x, e.detail.y];
    if(shiftDown) {
      const newCourse = structuredClone($courses[$courses.length - 1]);
      [newCourse.x, newCourse.y] = [e.detail.x, e.detail.y];
      newCourse.courseID = newCourse.courseID + 1;
      $courses = [...$courses, newCourse];
    }
  }

  function handleClick(e: CustomEvent) {
    if(isClose(courseDragging, [e.detail.x, e.detail.y], 5)) {
      if(selectedCourse === e.detail.courseID) {
        selectedCourse = null;
      } else {
        selectedCourse = e.detail.courseID;
      }
    }
    $courses = $courses
  }

  function isClose(point1: [number, number] | null, point2: [number, number], delta: number) {
    if(point1 === null) {
      return false;
    }
    return Math.sqrt(Math.pow(point2[0]-point1[0], 2) + Math.pow(point2[1]-point1[1], 2)) <= delta;
  }

  function handleCollisions() {
    for(let i = 0; i < $courses.length; i++) {
      for(let j = i + 1; j < $courses.length; j++) {
        if(checkCollision($courses[i], $courses[j])) {
          resolveCollision($courses[i], $courses[j]);
          $courses = $courses
        }
      }
    }
  }
</script>

<main>
  <div class="absolute">
    {#each $courses as course }
      <Course 
        course={ course } 
        on:drag={handleDrag} 
        on:click={handleClick} 
        bind:selected={selectedCourse} 
        bind:draggingLock={internalLock}
        on:southDown={(e) => {
          southStart = [e.detail.x, e.detail.y];
          drag.south = [true, false];
        }}
        on:southDrag={(e) => {
          if(drag.south[0]) {
            drag.south[1] = true;
            currentDragging = e.detail.courseID;
          }
        }}
        on:southOver={(e) => {
          if(currentDragging && e.detail.courseID !== currentDragging) {
            let overCourse = getCourseByCourseID(e.detail.courseID)
            if(overCourse !== null) {
              overCourse.subseqs.push(currentDragging);
            }
          }
        }}
      />
      {#if drag.south[0] && drag.south[1]}
        <svg class="absolute top-0 left-0 w-[100vw] h-[100vh]">
          <line x1={southStart[0]} y1={southStart[1]} x2={southEnd[0]} y2={southEnd[1]} stroke="black" stroke-width="2" />
        </svg>
      {/if}
    {/each}
  </div>
</main>
