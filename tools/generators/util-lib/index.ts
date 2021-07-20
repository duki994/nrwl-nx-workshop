import { Tree, formatFiles, installPackagesTask } from '@nrwl/devkit';
import { libraryGenerator } from '@nrwl/workspace/generators';

type LibrarySchema = Parameters<typeof libraryGenerator>[1];

interface Schema extends LibrarySchema {
  directory: string;
}

const checkNameHasUtil = (name: string) => name?.includes('util') ?? false;

const mergeTags = (existingTags?: string, newTags?: string) => {
  const trimmed = existingTags?.trim();
  if (trimmed && newTags) {
    return `${trimmed},${newTags}`.trim();
  }
};

export default async function (host: Tree, schema: Schema) {
  const name = checkNameHasUtil(schema.name)
    ? schema.name
    : `util-${schema.name}`;

  await libraryGenerator(host, { ...schema, name, tags: mergeTags(schema.tags, `scope:${schema.directory},type:util`) });
  await formatFiles(host);
  return () => {
    installPackagesTask(host);
  };
}
