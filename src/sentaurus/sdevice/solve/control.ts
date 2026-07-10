import useFormatUtils from "../format-utils";

type StepType = {
    MinStep: number;
    MaxStep: number;
    InitialStep: number;
    Increment: number;
    Decrement: number;
};

type DeviceGoalVoltage = {
    paramater: "Voltage";
    Name: string;
    Voltage: number;
};
type DeviceGoalCurrent = {
    paramater: "Current";
    Name: string;
    Current: number;
};
type DeviceGoalCharge = {
    paramater: "Charge";
    Name: string;
    Charge: number;
};

type DeviceGoalType = {
    kind: "device";
} & (DeviceGoalVoltage | DeviceGoalCurrent | DeviceGoalCharge);

const formatGoal = (e: DeviceGoalType) => {
    const retval: string[] = ["Goal", "{"];
    const { formatAssignment } = useFormatUtils(retval);
    formatAssignment(e, "Name");
    switch (e.paramater) {
        case "Voltage":
            formatAssignment(e, "Voltage");
            break;
        case "Current":
            formatAssignment(e, "Current");
            break;
        case "Charge":
            formatAssignment(e, "Charge");
            break;
    }
    retval.push("}");
    return retval;
};

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
        if (index !== e.length) retval.push(";");
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

export type { StepType, PlotType, DeviceGoalType };
export { formatPlot, formatGoal };
