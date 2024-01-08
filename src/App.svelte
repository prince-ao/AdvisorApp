<script lang="ts">
  import './app.css';
  import { CourseController } from './lib';
  import type { Courses } from './lib/types';

  const courses: Courses = [
    {
      courseID: 1,
      selected: false,
      name: "MTH 126",
      credits: 3,
      x: 300, // fix: change to screen width
      y: 300, // fix: change to screen height
    }
  ];
</script>

<main>
  <CourseController { courses } />
</main>
