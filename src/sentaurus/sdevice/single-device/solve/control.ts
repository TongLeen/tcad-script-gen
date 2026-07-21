import useFormatUtils from "../format-utils";
import { type Equation } from "./common/Equation";
import { formatSingle, type SingleType } from "./commands/Compute";
import { formatPlot, type PlotType } from "./commands/Plot";
import SDeviceFormat from "../format";

type StepType = {
    MinStep: number;
    MaxStep: number;
    InitialStep: number;
    Increment: number;
    Decrement: number;
};

const formatStep = (e: StepType) => {
    const r: string[] = [];
    const { formatAssignment } = useFormatUtils(r);
    formatAssignment(e, "InitialStep");
    formatAssignment(e, "MinStep");
    formatAssignment(e, "MaxStep");
    formatAssignment(e, "Increment");
    formatAssignment(e, "Decrement");
    return r;
};

type DeviceGoalType = {
    kind: "device";
} & (DeviceGoalVoltage | DeviceGoalCurrent | DeviceGoalCharge);

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

const formatGoal = (e: DeviceGoalType) => {
    const retval: string[] = ["Goal", "{"];
    const { formatAssignment } = useFormatUtils(retval);
    formatAssignment(e, "Name", (k, v) => `${k}="${v}"`);
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

type ContactBreakCriteria<T extends "MixedMode" = never> = {
    contact: string;
    DevName: T extends "MixedMode" ? string : never;
    Node: T extends "MixedMode" ? string : never;
    absval?: number;
    minval?: number;
    maxval?: number;
};
type BulkBreakCriteria<T extends "MixedMode" = never> = {
    DevName: T extends "MixedMode" ? string : never;
    maxval?: number;
};
type PowerBreakCriteria<T extends "MixedMode" = never> = {
    DevName: T extends "MixedMode" ? string : never;
    absval?: number;
    minval?: number;
    maxval?: number;
};

type BreakCriteria<T extends "MixedMode" = never> = {
    Voltage?: ContactBreakCriteria<T>;
    Current?: ContactBreakCriteria<T>;
    CurrentDensity?: BulkBreakCriteria<T>;
    ElectricField?: BulkBreakCriteria<T>;
    LatticeTemperature?: BulkBreakCriteria<T>;
    OuterDevicePower?: PowerBreakCriteria<T>;
    InnerDevicePower?: PowerBreakCriteria<T>;
};

type TransientTime = {
    CheckTransientError?: true;
    NoCheckTransientError?: true;
    TransientDigits?: number;
    TransientError?: Record<Equation, number>;
    TransientErrRef?: Record<Equation, number>;
    TrStepRejectionFactor?: number;
};

type RampControl = {
    goal?: DeviceGoalType | DeviceGoalType[];
    plot?: PlotType;
    equation: SingleType;
};

type AcceptNewtonParameter = never;

export type {
    StepType,
    DeviceGoalType,
    BreakCriteria,
    AcceptNewtonParameter,
    TransientTime,
};
export { formatStep, formatGoal };
