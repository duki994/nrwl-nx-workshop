import { Tree, formatFiles, installPackagesTask, updateJson } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

const workspaceJsonPath = 'workspace.json';

function updateDefaultProject(host: Tree, defaultProjectToSet: string) {
  updateJson(host, workspaceJsonPath, (json) => {
    if (json.defaultProject !== defaultProjectToSet) {
      json.defaultProject = defaultProjectToSet;
    }

    return json;
  })
}

export default async function (host: Tree, schema: any) {
  updateDefaultProject(host, 'api');
  await formatFiles(host);
}
