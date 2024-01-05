export interface CourseT {
  name: string;
  credits: number;
  x?: number;
  y?: number;
}

export type Courses = CourseT[];
