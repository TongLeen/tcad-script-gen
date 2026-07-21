import type { Equation } from "../../../definations";

type TransientTime = {
    CheckTransientError?: true;
    NoCheckTransientError?: true;
    TransientDigits?: number;
    TransientError?: Record<Equation, number>;
    TransientErrRef?: Record<Equation, number>;
    TrStepRejectionFactor?: number;
};

export type { TransientTime };
