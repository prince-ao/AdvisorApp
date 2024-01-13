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
  let overCourse: CourseT | null = null;
  let drag = {
    south: new Map<CourseID, [boolean, boolean]>(),
    north: [false, false],
    east: [false, false],
    west: [false, false],
  }
  let internalLock = false;

$: console.log($courses)


  $: svgLines = $courses.map(course => {
    if (course.prereqs && course.prereqs.length > 0) {
      return course.prereqs.map(prereq => {
        const subCourse = getCourseByCourseID(prereq);
        return { 
          startX: course.x + course.w / 2, 
          startY: course.y + course.h, 
          endX: subCourse.x + subCourse.w / 2, 
          endY: subCourse.y + subCourse.h, 
          startCourseID: course.courseID, 
          endCourseID: prereq 
        };
      });
    }
    return [];
  }).flat();

  onMount(() => {
    document.addEventListener('mousemove', (e) => {
      if(currentDragging !== null && drag.south.has(currentDragging) && drag.south.get(currentDragging)![0] && drag.south.get(currentDragging)![1]) {
        southEnd = [e.x, e.y];
      }
    })

    document.addEventListener('mouseup', (e) => {
      if(overCourse !== null && currentDragging !== null) {
      addPrerequisite(overCourse.courseID, currentDragging);
        overCourse = null;
      }
      southEnd = [0, 0] 
      southStart = [0, 0]
      if(currentDragging !== null) {
        drag.south.set(currentDragging, [false, false]);
        drag = drag
      }
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
        $courses = $courses.filter((course) => course.courseID !== selectedCourse);
        $courses = $courses;
      }
    })

    setInterval(() => {
      handleCollisions();
    }, 33);

    
  })

  function addPrerequisite(overCourseID: CourseID, currentDraggingID: CourseID) {
    const updatedCourses = $courses.map(course => {
      if (course.courseID === overCourseID) {
        const newPrereqs = [...course.prereqs, currentDraggingID];
        return { ...course, prereqs: newPrereqs };
      } else if (course.courseID === currentDraggingID) {
        const newSubseqs = [...course.subseqs, overCourseID];
        return { ...course, subseqs: newSubseqs };
      }
      return course;
    });

    $courses = updatedCourses; // Triggers reactivity
  }

  function updateCoursePosition(courseID: CourseID, newX: number, newY: number) {
    // Update the position of the specified course
    $courses = $courses.map(course => {
      if (course.courseID === courseID) {
        return { ...course, x: newX, y: newY };
      }
      return course;
    });
  }

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

  function handleLineClick(startCourseID: CourseID, endCourseID: CourseID) {
    $courses = $courses.map(course => {
      if (course.courseID === startCourseID) {
        return { ...course, subseqs: course.subseqs.filter(id => id !== endCourseID) };
      }
      if (course.courseID === endCourseID) {
        return { ...course, prereqs: course.prereqs.filter(id => id !== startCourseID) };
      }
      return course;
    });
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
          southStart = [e.detail.e.x, e.detail.e.y];
          drag.south.set(e.detail.courseID, [true, false]);
          drag = drag
        }}
        on:updatePosition={(e) => updateCoursePosition(e.detail.courseID, e.detail.newX, e.detail.newY)}
        on:southDrag={(e) => {
          if(drag.south.has(e.detail.courseID) && drag.south.get(e.detail.courseID)?.[0]) {
            drag.south.set(e.detail.courseID, [true, true]);
            drag = drag
            currentDragging = e.detail.courseID;
          }
        }}
        on:southOver={(e) => {
          if(currentDragging && e.detail.courseID !== currentDragging) {
            overCourse = getCourseByCourseID(e.detail.courseID)
          }
        }}
        on:southOut={(e) => {
          overCourse = null;
        }}
      />
      {#if drag.south.has(course.courseID) && drag.south.get(course.courseID)?.[1] && drag.south.get(course.courseID)?.[0]}
        <svg class="absolute top-0 left-0 w-[100vw] h-[100vh]">
          <line x1={southStart[0]} y1={southStart[1]} x2={southEnd[0]} y2={southEnd[1]} stroke="black" stroke-width="2" />
        </svg>
      {/if}
      {#each svgLines as line }
        <svg 
          class="absolute pointer-events-none"
          style="left: {Math.min(line.startX, line.endX)}px; top: {Math.min(line.startY, line.endY)}px; width: {Math.abs(line.endX - line.startX)}px; height: {Math.abs(line.endY - line.startY)}px;"
        >
          <rect 
            x="{Math.min(0, line.endX - line.startX)}" 
            y="{Math.min(0, line.endY - line.startY)}" 
            width="{Math.abs(line.endX - line.startX)}" 
            height="{Math.abs(line.endY - line.startY)}"
            fill="black" />
          <line 
            x1={line.startX < line.endX ? 0 : Math.abs(line.endX - line.startX)} 
            y1={line.startY < line.endY ? 0 : Math.abs(line.endY - line.startY)} 
            x2={line.startX < line.endX ? Math.abs(line.endX - line.startX) : 0} 
            y2={line.startY < line.endY ? Math.abs(line.endY - line.startY) : 0} 
            stroke="black" stroke-width="2" />
        </svg>
      {/each}
    {/each}
  </div>
</main>
