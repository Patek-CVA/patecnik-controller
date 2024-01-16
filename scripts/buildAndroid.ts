// Run this script from the main project directory only!

// Assets generation:
// yarn capacitor-assets generate --iconBackgroundColor '#eeeeee' --iconBackgroundColorDark '#222222' --splashBackgroundColor '#eeeeee' --splashBackgroundColorDark '#111111' --android
// This will replace all the android mipmaps and drawables!!!

import {ChildProcess} from 'node:child_process';
import {spawn} from 'cross-spawn';
import * as fse from 'fs-extra';
import * as fs from 'fs';

// The docker capacitor builder container name
const builderContainerName: string = 'capacitor-builder';
// A list of files used to detect whether the current directory is the main project directory
const mainDirRequirements: string[] = ['android', 'public', 'src', 'package.json', 'tsconfig.json', 'yarn.lock'];

async function main(): Promise<void> {
    // Check if docker is installed
    if (!await testCmd('docker', ['--version'], false)) {
        console.error('Docker is not installed!');
        return;
    }
    // Check if yarn is installed
    if (!await testCmd('yarn', ['--version'], false)) {
        console.error('Yarn is not installed!');
        return;
    }
    // Check if the current directory is the main project directory
    const items: string[] = await fs.promises.readdir('./');
    if (!mainDirRequirements.every((item: string) => items.includes(item))) {
        console.error('The current directory is not the main project directory!\n' +
            'Please move to the main project directory and call this script from there.');
        return;
    }
    // Check if the docker container exists and start it
    if (!await testCmd('docker', ['start', builderContainerName], false)) {
        console.error('The docker container does not exist or it could not be started!');
        return;
    }

    // Everything seems right

    // Build react website
    await cmd('yarn', ['react-scripts', 'build']);
    // Synchronize capacitor projects
    await cmd('yarn', ['cap', 'sync']);
    // Clean the builder container workdir
    await cmd('docker', ['exec', '-ti', builderContainerName, 'wclean']);
    // Copy the project files
    await cmd('docker', ['cp', '.', builderContainerName + ':/work']);
    // Build the android project using gradle
    await cmd('docker', ['exec', '-ti', builderContainerName, 'wgradle', 'build']);
    await fse.remove('dist');
    await fse.mkdir('dist');
    await cmd('docker', ['cp', builderContainerName + ':/work/android/app/build', 'dist']);
    // Stop the builder container
    await cmd('docker', ['stop', builderContainerName]);
}

async function testCmd(command: string, args: string[] = [], stdio: boolean = true): Promise<boolean> {
    try {
        await cmd(command, args, stdio);
    } catch (error: any) {
        return false;
    }
    return true;
}

const cmd = (command: string, args: string[] = [], stdio: boolean = true): Promise<void> => new Promise<void>((resolve, reject): void => {
    const childProcess: ChildProcess = spawn(command, args, {stdio: stdio ? 'inherit' : 'pipe'});

    childProcess.on('exit', (code: number): void =>
        code === 0 ?
            resolve() :
            reject(new Error(`Command "${command}" exited with code ${code}!`))
    );

    childProcess.on('error', (error: Error): void => reject(error));
});

main();