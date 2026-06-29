import draw from "./draw";
import contact from "./contact";
import dop from "./dop";
import mesh from "./mesh";

const useSde = <M extends string, D extends string>() => {
    let cmds: string[] = []

    const save = (filename: string) => {
        Bun.write(filename, cmds.join('\n'))
    }

    return {
        save,
        draw: draw<M>(cmds),
        contact: contact(cmds),
        dop: dop<M, D>(cmds),
        mesh: mesh<M>(cmds),
    }
}

export default useSde;