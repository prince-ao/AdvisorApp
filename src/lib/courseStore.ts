import type { Courses } from './types';
import { writable } from 'svelte/store';

export const courses = writable<Courses>([
  {
    courseID: 1,
    name: "MTH 126",
    credits: 3,
    x: 300,
    y: 300,
    w: 300,
    h: 150,
    prereqs: [],
    subseqs: [],
    coreqs: [],
  }
]);
