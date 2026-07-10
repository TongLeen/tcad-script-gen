import useFormatUtils from "../format-utils";
import { type Equation } from "./common/Equation";

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

type BreakCriteria = {};

type TransientTime = {
    CheckTransientError?: true;
    NoCheckTransientError?: true;
    TransientDigits?: number;
    TransientError?: Record<Equation, number>;
    TransientErrRef?: Record<Equation, number>;
    TrStepRejectionFactor?: number;
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
