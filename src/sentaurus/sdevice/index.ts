import { fileGenerator } from "./file"
import { electrodeGenerator } from "./electrode"
import { physicsGenerator } from "./physics"
import { mathGenerator } from "./math"

const useSdevice = <M extends string, D extends string>() => {
    let cmds: string[] = []

    const save = (filename: string) => {
        Bun.write(filename, format(cmds))
    }


    return {
        file: fileGenerator(cmds),
        electrode: electrodeGenerator(cmds),
        physics: physicsGenerator<M, D>(cmds),
        math: mathGenerator(cmds),
        save,
    }
}

export default useSdevice;


const format = (cmds: string[]) => {
    let lines: [number, string][] = []

    let level: number = 0
    for (const t of cmds) {
        if (t === '}' || t === ')') {
            level--;
        }
        lines.push([level, t])
        if (t === '{' || t === '(') {
            level++;
        }
    }

    return lines
        .map(([l, v]) => `${'    '.repeat(l)}${v}`)
        .join('\n');
}