export interface CourseT {
  courseID: CourseID;
  name: string;
  credits: number;
  x: number;
  y: number;
  w: number;
  h: number;
  prereqs: CourseID[];
  subseqs: CourseID[];
  coreqs: CourseID[];
}

export type Courses = CourseT[];

export type CourseID = number;
