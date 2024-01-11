import type { CourseT } from '../types';
import { get } from 'svelte/store';
import { courses } from '../courseStore';

export function resolveCollision(course1: CourseT, course2: CourseT) {
  const overlapX = Math.min(course1.x + course1.w, course2.x + course2.w) - Math.max(course1.x, course2.x);
  const overlapY = Math.min(course1.y + course1.h, course2.y + course2.h) - Math.max(course1.y, course2.y);

  if (overlapX < overlapY) {
      // Horizontal collision
      const moveX = overlapX / 2;
      if (course1.x < course2.x) {
          course1.x -= moveX;
          course2.x += moveX;
      } else {
          course2.x -= moveX;
          course1.x += moveX;
      }
  } else {
      // Vertical collision
      const moveY = overlapY / 2;
      if (course1.y < course2.y) {
          course1.y -= moveY;
          course2.y += moveY;
      } else {
          course2.y -= moveY;
          course1.y += moveY;
      }
  }
}

export function checkCollision(course1: CourseT, course2: CourseT) {
  const collisionX = course1.x + course1.w >= course2.x && course1.x <= course2.x + course2.w;
  const collisionY = course1.y + course1.h >= course2.y && course1.y <= course2.y + course2.h;

  return collisionX && collisionY;
}
