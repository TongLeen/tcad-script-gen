import { argv } from "bun"

type FileType = {
    Grid?: string
    Parameter?: string
    Output?: string
    Plot?: string
    Current?: string
}
const fileGenerator = (ctx: string[]) => {
    const file = (args: FileType) => {
        const args_pair =
            Object.entries(args).map(([k, v]) => `${k}=${v}`)
        ctx.push(
            "File", "{",
            ...args_pair,
            "}",
        )
    }
    return file;
}


export { fileGenerator };
export type { FileType };