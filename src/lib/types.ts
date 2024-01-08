export interface CourseT {
  courseID: number;
  name: string;
  credits: number;
  x?: number;
  y?: number;
}

export type Courses = CourseT[];

export type CourseID = number;
