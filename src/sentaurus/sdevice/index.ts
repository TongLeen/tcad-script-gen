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
        math: mathGenerator<M>(cmds),
        save,
    }
}

export default useSdevice;


const format = (cmds: string[]) => {
    let cmds_no_empty_parenthese = removeAdjacentParensOnce(cmds)

    let lines: [number, string][] = []

    let level: number = 0
    for (const t of cmds_no_empty_parenthese) {
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

const removeAdjacentParensOnce = (tokens: string[]) => {
    const result: string[] = [];
    let i = 0;
    while (i < tokens.length) {
        // 检查当前及下一个是否是 "(" 和 ")"
        if (i + 1 < tokens.length && tokens[i] === "(" && tokens[i + 1] === ")") {
            i += 2; // 直接跳过这一对，不加入结果
        } else {
            result.push(tokens[i] as string);
            i++;
        }
    }
    return result;
}