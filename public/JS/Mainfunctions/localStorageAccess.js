
import LocalStorageAdapter from "../LocalStorageAdapter.js";
import {createProject} from "../Project.js";
import ProjectStore from "../ProjectStoreX.js"; 


let project = null;
let projectStore = null;
//   create or use a project depending on whether is exit on
export function initLocalStorage(){ 
  //====================================================================
                       
 const CURRENT_PROJECT_KEY =
    "wulirocks.currentProject";

const projectId =
    localStorage.getItem(CURRENT_PROJECT_KEY);

  projectStore =
    new ProjectStore(
        new LocalStorageAdapter()
    );

    project =
    projectId
        ? projectStore.load(projectId)
        : null;

if (!project) {

    project = createProject();

    projectStore.save(project);

    localStorage.setItem(
        CURRENT_PROJECT_KEY,
        project.id
    );
}
 
} 


export function getProject(){ 
         return project;
}
export function getProjectStore(){ 
         return projectStore;
}