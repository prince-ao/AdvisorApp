<script lang="ts">
  import './app.css';
  import { CourseController } from './lib';
  import type { Courses } from './lib/types';

  const courses: Courses = [
    {
      courseID: 1,
      name: "MTH 126",
      credits: 3,
      x: 300,
      y: 300,
      w: 300,
      h: 150
    }
  ];
</script>

<main>
  <CourseController { courses } />
</main>
