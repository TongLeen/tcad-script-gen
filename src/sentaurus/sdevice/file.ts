import SDeviceFormat from "./format";

type FileType = {
    Grid?: string;
    Parameter?: string;
    Output?: string;
    Plot?: string;
    Current?: string;
    NonLocalPlot?: string;
    NewtonPlot?: string;
};

const fileGenerator = (ctx: string[]) => {
    const file = (args: FileType) => {
        ctx.push(
            "File",
            "{",
            ...SDeviceFormat(args)({
                assignString: [
                    "Current",
                    "Grid",
                    "Output",
                    "Parameter",
                    "Plot",
                    "NonLocalPlot",
                    "NewtonPlot",
                ],
            }),
            "}",
        );
    };
    return file;
};

export { fileGenerator };
export type { FileType };
