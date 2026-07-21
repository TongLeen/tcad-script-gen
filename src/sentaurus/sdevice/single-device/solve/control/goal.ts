type ContactRampGoal = (
    | { kind: "Device"; Name: string }
    | { kind: "MixedMode"; Contact: { device: string; contact: string } }
) & {
    Voltage?: number;
    Current?: number;
    Charge?: number;
};

type TransientGoal = ContactRampGoal;

type QuasiFermiRampGoal<M extends string> = {
    DopingWell?: [number, number, number];
    DopingWells?: { Material: M } | { Region: string } | "Semiconductor";
    WellContactName?: string;
    eQuasiFermi?: number;
    hQuasiFermi?: number;
};

type ParameterRampGoal<M extends string> = {
    Device?: string;
    specific?:
        | {
              Material: M;
          }
        | {
              MaterialInterface: [M, M];
          }
        | {
              Region: string;
          }
        | {
              RegionInterface: [string, string];
          };
    Model: string;
    Parameter: string;
    Value: number;
};

type QuasistationaryGoal<
    M extends string,
    T extends "Device" | "MixedMode" = "Device",
> = ContactRampGoal<T> | QuasiFermiRampGoal<M> | ParameterRampGoal<M>;

export type { TransientGoal, QuasistationaryGoal };

import SDeviceFormat from "../../format";

const formatTransientGoal = <T extends "Device" | "MixedMode" = "Device">(
    g: TransientGoal<T>,
) =>
    SDeviceFormat(g)({
        assign: ["Voltage", "Current"],
    });
