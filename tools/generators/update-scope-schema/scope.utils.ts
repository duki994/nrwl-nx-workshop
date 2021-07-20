import { NxConfig } from './nxconfig.interface';

export function getUniqueScopes(nxConfig: NxConfig): Iterable<string> {
  const { projects } = nxConfig;

  return Object.values(projects)
    .map((project) => Object.values(project.tags))
    .reduce((uniqueScopes, curr) => {
      curr.filter(t => t.startsWith('scope:'))
        .map(scope => scope.slice(6)) // remove leading 'scope:'
        .forEach((scope) => uniqueScopes.add(scope));
      return uniqueScopes;
    }, new Set<string>());
}
