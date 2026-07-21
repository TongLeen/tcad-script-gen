import { tmpdir } from "node:os";
import { join } from "node:path";

import { fileGenerator } from "./mode-independent/file";
import { electrodeGenerator } from "./mode-independent/electrode";
import { physicsGenerator } from "./mode-independent/physics";
import { plotGenerator } from "./mode-independent/plot";

import { mathGenerator as mathGenerator_single } from "./single-device/math";
import { solveGenerator as solveGenerator_single } from "./single-device/solve";

const useSdevice = <M extends string, D extends string>() => {
    let cmds: string[] = [];

    const [api, solve_gen] = solveGenerator_single();

    const generate = () => {
        return format(cmds.concat(solve_gen()));
    };

    const save = (filename: string) => {
        Bun.write(filename, generate());
    };

    const run = (filename?: string) => {
        if (filename === undefined) {
            const uuid = crypto.randomUUID();
            const tmpfilepath = join(tmpdir(), uuid) + ".cmd";
            Bun.write(tmpfilepath, generate());
            console.log(`Write tmp cmd in '${tmpfilepath}'`);
            const proc = Bun.spawnSync({
                cmd: ["sdevice", tmpfilepath],
                stdout: "inherit",
                stderr: "inherit",
            });
            Bun.file(tmpfilepath)
                .delete()
                .catch((e) => {
                    console.warn(`File delete failure: ${e}`);
                });
            return proc.exitCode;
        } else {
            const proc = Bun.spawnSync({
                cmd: ["sdevice", filename],
                stdout: "inherit",
                stderr: "inherit",
            });
            return proc.exitCode;
        }
    };

    const runAndExit = (filename?: string) => {
        process.exit(run(filename));
    };

    const raw = (raw: string) => {
        cmds.push(raw);
    };

    return {
        file: fileGenerator(cmds),
        electrode: electrodeGenerator(cmds),
        physics: physicsGenerator<M, D>(cmds),
        math: mathGenerator_single<M>(cmds),
        plot: plotGenerator(cmds),
        solve: api,
        raw,
        save,
        run,
        runAndExit,
    };
};

export default useSdevice;

const format = (cmds: string[]) => {
    let cmds_no_empty_parenthese = removeAdjacentParensOnce(cmds);

    let lines: [number, string][] = [];

    let level: number = 0;
    for (const t of cmds_no_empty_parenthese) {
        if (t === "}" || t === ")") {
            level--;
        }
        lines.push([level, t]);
        if (t === "{" || t === "(") {
            level++;
        }
    }

    return lines.map(([l, v]) => `${"    ".repeat(l)}${v}`).join("\n");
};

const removeAdjacentParensOnce = (tokens: string[]) => {
    const result: string[] = [];
    let i = 0;
    while (i < tokens.length) {
        // 检查当前及下一个是否是 "(" 和 ")"
        if (
            i + 1 < tokens.length &&
            tokens[i] === "(" &&
            tokens[i + 1] === ")"
        ) {
            i += 2; // 直接跳过这一对，不加入结果
        } else {
            result.push(tokens[i] as string);
            i++;
        }
    }
    return result;
};
