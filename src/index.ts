import { execSync } from "node:child_process";
import { join, sep } from "node:path";
import { getFolder, getNodeModulesOfFolder, readPackageJSON } from "./utils";

export type ResolveFunction = (name: string) => string | undefined;
export type ResolveFromFunction = (
  name: string,
  root?: string,
) => string | undefined;
export type DirectoryFunction = (name: string) => string;
export type DirectoryFromFunction = (name: string, root?: string) => string;
export type RequireFunction = (name: string) => object;
export type RequireFromFunction = (name: string, root?: string) => object;
export interface RequireObject extends RequireFunction {
  resolve: ResolveFunction;
  directory: DirectoryFunction;
}
export interface RequireFromObject extends RequireFromFunction {
  resolve: ResolveFromFunction;
  directory: DirectoryFromFunction;
}

let globalRoot: string;
const getGlobalRoot = (): string => {
  if (!globalRoot) {
    globalRoot = execSync("npm root -g", { encoding: "utf8" })
      .trim()
      .replace(/node_modules$/, "");
  }
  return globalRoot;
};

const checkScopedNodeModulesOfFolder = (
  folder: string,
  name: string,
): string => {
  const directModules: string[] = getNodeModulesOfFolder(folder);
  const found = directModules.find((subfolder: string): boolean => {
    return getFolder(subfolder) === name;
  });
  if (!found) {
    throw Error(`Cannot find module: "${name}"`);
  }
  return join(folder, found);
};

const checkNodeModulesOfFolder = (
  folder: string,
  name: string,
): string | undefined => {
  const root: string = join(folder, "node_modules");
  const nodeModules: string[] = getNodeModulesOfFolder(root);
  for (const nodeModule of nodeModules) {
    if (getFolder(nodeModule) === name) {
      return join(root, nodeModule);
    }
    getNodeModulesOfFolder(join(root, nodeModule, "node_modules")).forEach(
      (subModule: string): void => {
        nodeModules.push(join(nodeModule, "node_modules", subModule));
      },
    );
  }
};

const resolveMainFile = (name: string, root: string): string | undefined => {
  const names = name.match(/^(@[^/]+)\/(.+)$/);
  let pathToFolder: string | undefined;
  if (names) {
    const pathToModule = checkNodeModulesOfFolder(root, names[1]);
    pathToFolder = checkScopedNodeModulesOfFolder(
      pathToModule as string,
      names[2],
    );
  } else {
    pathToFolder = checkNodeModulesOfFolder(root, name);
  }
  if (!pathToFolder) return;
  const packageJSON = readPackageJSON(pathToFolder);
  if (!packageJSON.main) return;
  return join(pathToFolder, packageJSON.main);
};

const resolve: ResolveFromFunction = (
  name: string,
  root?: string,
): string | undefined => {
  if (root) {
    return resolveMainFile(name, root);
  }
  try {
    return require.resolve(name);
  } catch {
    return resolveMainFile(name, process.cwd());
  }
};

const directory: DirectoryFromFunction = (
  name: string,
  root?: string,
): string => {
  const pathToModule = resolve(name, root);
  if (!pathToModule) {
    throw Error(`Cannot find module: "${name}"`);
  }
  name = name.replace("/", sep);
  const pathPieces = pathToModule
    .split(name + sep)
    .filter((p: string): boolean => !/^[/\\]$/.test(p))
    .filter((p: string): boolean => !/\.[^.\\/]+$/.test(p));
  if (pathPieces.length > 1) {
    return pathPieces.join(name);
  }
  return join(pathPieces[0], name);
};

export const requireIt: RequireObject = ((name: string): object => {
  return require(requireIt.resolve(name) as string);
}) as RequireObject;
requireIt.resolve = (name: string): string | undefined => resolve(name);
requireIt.directory = (name: string): string => directory(name);

export const requireGlobal: RequireObject = ((name: string): object => {
  return require(requireGlobal.resolve(name) as string);
}) as RequireObject;
requireGlobal.resolve = (name: string): string | undefined =>
  resolve(name, getGlobalRoot());
requireGlobal.directory = (name: string): string =>
  directory(name, getGlobalRoot());

export const requireFrom: RequireFromObject = ((
  module: string,
  root?: string,
): object => {
  return require(resolve(module, root) as string);
}) as RequireObject;
requireFrom.resolve = resolve;
requireFrom.directory = directory;
