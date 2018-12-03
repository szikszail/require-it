import { readdirSync, statSync } from "fs";
import { join } from "path";

export const isFile = (file: string): boolean => {
    try {
        return statSync(file).isFile();
    } catch (e) {
        return false;
    }
};

export const isFolder = (folder: string): boolean => {
    try {
        return statSync(folder).isDirectory();
    } catch (e) {
        return false;
    }
};

export const isScopedModule = (name: string): boolean => {
    return isFolder(name) && /@[^/\\]*$/.test(name);
};

export const isNodeModule = (name: string): boolean => {
    return isFolder(name) && (isFolder(join(name, "node_modules")) || isFile(join(name, "package.json")));
};

export const getNodeModulesOfFolder = (folder: string): string[] => {
    try {
        return readdirSync(folder).filter((subfolder: string): boolean => {
            const path = join(folder, subfolder);
            return isNodeModule(path) || isScopedModule(path);
        });
    } catch (e) {
        return [];
    }
};

export interface PackageJSON {
    main: string;
}

export const getFolder = (path: string): string => path.split(/[\/\\]/).pop();
export const readPackageJSON = (folder: string): PackageJSON => require(join(folder, "package.json"));
