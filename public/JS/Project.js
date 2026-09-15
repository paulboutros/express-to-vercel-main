
//user's persistent workspace
export function createProject() {

    const now = new Date().toISOString();

    return {
       // metadata: {
            id: crypto.randomUUID(),
         //   createdAt: now,
         //   updatedAt: now,
          //  version: 1
       // },

        preferences: {},

        architecture: null,

        jsonData:{
            
        },

        sheets: {},

        queries: {}
    };
}

/*
 function createProjectId() {

    return `local-${crypto.randomUUID()}`;
}
  */  