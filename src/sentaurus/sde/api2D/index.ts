import draw from "./draw";
import contact from "./contact";
import dop from "./dop";
import mesh from "./mesh";

const useSde = <M extends string, D extends string>() => {
    let cmds: string[] = []

    const save = (filename: string) => {
        Bun.write(filename, cmds.join('\n'))
    }

    const run = () => {
        const stdin_data = cmds.join('\n')
        const proc = Bun.spawnSync({
            cmd: ["sde", "-e", "-r"],
            stdin: new Blob([stdin_data]),
            stdout: 'inherit',
            stderr: 'inherit',
        })
        return proc.exitCode
    }

    const runAndExit = () => {
        process.exit(run())
    }

    return {
        save,
        run,
        runAndExit,
        draw: draw<M>(cmds),
        contact: contact(cmds),
        dop: dop<M, D>(cmds),
        mesh: mesh<M>(cmds),
    }
}

export default useSde;