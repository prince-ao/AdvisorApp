import type { CourseID, CourseT } from '../types';
import { courses } from '../courseStore';
import { get } from 'svelte/store';

export function getCourseByCourseID(courseID: CourseID): CourseT {
  for(let i = 0; i < get(courses).length; i++) {
    if(get(courses)[i].courseID === courseID) {
      return get(courses)[i];
    }
  }

  throw new Error(`Course not found: ${courseID}`);
  // return get(courses)[0];
}
