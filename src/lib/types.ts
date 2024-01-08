export interface CourseT {
  courseID: number;
  name: string;
  credits: number;
  selected: boolean;
  x?: number;
  y?: number;
}

export type Courses = CourseT[];

export type CourseID = number;
