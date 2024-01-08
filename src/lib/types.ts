export interface CourseT {
  courseID: number;
  name: string;
  credits: number;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  //       startx, starty, endx,   endy
  south?: [number, number, number, number]
}

export type Courses = CourseT[];

export type CourseID = number;
