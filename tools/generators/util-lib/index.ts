import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

interface Schema {
  name: string;
  tags?: string;
  directory: 'api' | 'store' | 'shared';
}

const checkNameHasUtil = (name: string) => name?.includes('util') ?? false;

const mergeTags = (
  existingTags?: string,
  newTags?: string
): string | undefined => {
  const trimmed = existingTags?.trim();
  if (trimmed && newTags) {
    return `${trimmed},${newTags}`.trim();
  }

  return newTags;
};

const sanitizeName = (name?: string): string | undefined | null =>
  name?.charAt(0) === '-' ? name.substr(1) : name;

export default async function (host: Tree, schema: Schema) {
  const name = checkNameHasUtil(schema.name)
    ? schema.name
    : `util-${sanitizeName(schema.name)}`;

  const libScheme: Schema = {
    ...schema,
    name,
    tags: mergeTags(schema.tags, `scope:${schema.directory},type:util`),
  };

  await libraryGenerator(host, libScheme);
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
