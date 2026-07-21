import type { FileDefination } from "../definations";

type FileType = {
    [k in FileDefination]?: string;
};

const fileGenerator = (ctx: string[]) => {
    const file = (args: FileType) => {
        ctx.push(
            "File",
            "{",
            ...Object.entries(args).map(([k, v]) => `${k}="${v}"`),
            "}",
        );
    };
    return file;
};

export { fileGenerator };
export type { FileType };
