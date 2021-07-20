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
const utilLibIndexTsPath = 'tools/generators/util-lib/index.ts';

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
    )
      .sort() // sort for better readability and consistency
      .map((s) => ({ value: s, label: s }));

    schema.properties.directory['x-prompt'].items = newPromptItems;
    return schema;
  });
}

function joinScopes(scopes: Iterable<string>) {
  let str = ``;
  for (const scope of scopes) {
    str += `${scope},`
  }
  return str.substring(0, str.length - 1);
}

function updateUtilLibSchemaInterface(host: Tree, scopes: Iterable<string>) {
  const PATTERN = /interface Schema \{\n.*\n.*\n\}/;
  const index = host.read(utilLibIndexTsPath, 'utf-8');
  index.replace(PATTERN,
    `interface Schema {
      name: string;
      directory: ${joinScopes(scopes)}
    }`);

  host.write(utilLibIndexTsPath, index);
};


export default async function (host: Tree, schema: any) {
  updateDefaultProject(host, 'api');
  const uniqueScopes = readScopes(host);
  updateUtilLibSchemaJson(host, uniqueScopes);
  updateUtilLibSchemaInterface(host, uniqueScopes);
  await formatFiles(host);
}
