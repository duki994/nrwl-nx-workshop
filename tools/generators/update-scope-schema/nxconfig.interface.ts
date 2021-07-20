export interface NxProjects {
  [k: string]: NxProject;
}

export interface NxProject {
  [k: string]: any;
  tags: string[];
}

export interface NxConfig {
  [k: string]: any;
  projects: NxProjects
}
