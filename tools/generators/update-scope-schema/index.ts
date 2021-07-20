import {
  Tree,
  formatFiles,
  installPackagesTask,
  updateJson,
  readJson,
} from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';
import { NxConfig } from './nxconfig.interface';
import { getUniqueScopes } from './scope.utils';

const workspaceJsonPath = 'workspace.json';
const nxJsonPath = 'nx.json';
const utilLibGeneratorSchemaPath = 'tools/generators/util-lib/schema.json';

function updateDefaultProject(host: Tree, defaultProjectToSet: string) {
  updateJson(host, workspaceJsonPath, (json) => {
    if (json.defaultProject !== defaultProjectToSet) {
      json.defaultProject = defaultProjectToSet;
    }

    return json;
  });
}

function readScopes(host: Tree): Iterable<string> {
  const nxConfig = readJson<NxConfig>(host, nxJsonPath);
  return getUniqueScopes(nxConfig);
}

function updateUtilLibSchemaJson(host: Tree, scopes: Iterable<string>) {
  return updateJson(host, utilLibGeneratorSchemaPath, (schema) => {
    const newPromptItems: { value: string; label: string }[] = Array.from(
      scopes
    ).map((s) => ({ value: s, label: s }));

    schema.properties.directory['x-prompt'].items = newPromptItems;
    return schema;
  });
}

export default async function (host: Tree, schema: any) {
  updateDefaultProject(host, 'api');
  const uniqueScopes = readScopes(host);
  updateUtilLibSchemaJson(host, uniqueScopes);

  await formatFiles(host);
}
