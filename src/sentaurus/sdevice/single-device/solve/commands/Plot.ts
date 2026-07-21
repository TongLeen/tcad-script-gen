import useFormatUtils from "../../format-utils";

type PlotTime = (
    | number
    | {
          range: [number, number];
          intervals?: number;
          decade?: true;
      }
)[];

const formatPlotTime = (e: PlotTime) => {
    const retval: string[] = ["Time", "=", "("];
    e.forEach((v, index) => {
        if (typeof v === "number") retval.push(`${v}`);
        else {
            retval.push(`range=(${v.range.join(" ")})`);
            if (v.intervals) retval.push(`intervals=${v.intervals}`);
            if (v.decade) retval.push("decade");
        }
        if (index !== e.length - 1) retval.push(";");
    });
    retval.push(")");
    return retval;
};

type PlotWhen = {
    Contact: string;
    Current?: number;
    Voltage?: number;
};

type PlotType = {
    Explicit?: boolean;
    FilePrefix?: string;
    Iterations?: number[];
    IterationStep?: number;
    Loadable?: boolean;
    noOverwrite?: true;
    Number?: number;
    Time?: PlotTime;
    When?: PlotWhen;
};

const formatPlot = (e: PlotType) => {
    const retval: string[] = [];
    const { formatAssignment, formatSwitch, formatFlag, formatBlock } =
        useFormatUtils(retval);
    formatFlag(e, "noOverwrite");
    formatSwitch(e, "Explicit");
    formatSwitch(e, "Loadable");
    formatAssignment(e, "FilePrefix", (k, v) => `${k}="${v}"`);
    if (e.Iterations) retval.push(`Iterations=(${e.Iterations.join(";")})`);
    formatAssignment(e, "IterationStep");
    formatAssignment(e, "Number");
    if (e.Time !== undefined) retval.push(...formatPlotTime(e.Time));
    formatBlock(e, "When", (k) => {
        const l: string[] = [];
        const { formatAssignment } = useFormatUtils(l);
        formatAssignment(k, "Contact", (k, v) => `${k}="${v}"`);
        formatAssignment(k, "Current");
        formatAssignment(k, "Voltage");
        return l;
    });
    return retval;
};

export { formatPlot };
export type { PlotType };
