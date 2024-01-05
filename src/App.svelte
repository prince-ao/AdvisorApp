<script lang="ts">
  import './app.css';
  import { CourseController } from './lib';
  import type { Courses } from './lib/types';

  const courses: Courses = [
    {
      name: "MTH 126",
      credits: 3,
      x: Math.floor(Math.random() * 1500), // fix: change 1500 to screen width
      y: Math.floor(Math.random() * 1000), // fix: change 1000 to screen height
    }
  ];
</script>

<main>
  <CourseController { courses } />
</main>
