type ContactRampGoal = {
    Name: string;
} & (
    | {
          Voltage: number;
      }
    | {
          Current: number;
      }
    | {
          Charge: number;
      }
);

type TransientGoal = ContactRampGoal;

type QuasiFermiRampGoal<M extends string> = (
    | {
          DopingWell: [number, number, number];
      }
    | {
          DopingWells: { Material: M } | { Region: string } | "Semiconductor";
      }
    | {
          WellContactName: string;
      }
) &
    (
        | {
              eQuasiFermi: number;
          }
        | {
              hQuasiFermi: number;
          }
    );

type ParameterRampGoal<M extends string> = (
    | {
          Material?: M;
      }
    | {
          MaterialInterface?: [M, M];
      }
    | {
          Region?: string;
      }
    | {
          RegionInterface?: [string, string];
      }
) & {
    Model: string;
    Parameter: string;
    Value: number;
};

type QuasistationaryGoal<M extends string> =
    ContactRampGoal | QuasiFermiRampGoal<M> | ParameterRampGoal<M>;

export type { TransientGoal, QuasistationaryGoal };

import SDeviceFormat from "../../../utils/format";

const formatTransientGoal = (g: TransientGoal) =>
    SDeviceFormat(g)({
        assign: ["Voltage", "Current", "Charge"],
        assignString: ["Name"],
    });

const formatQuasistationaryGoal = <M extends string>(
    g: QuasistationaryGoal<M>,
) =>
    SDeviceFormat(g)({
        assign: [
            "Voltage",
            "Current",
            "Charge",
            "eQuasiFermi",
            "hQuasiFermi",
            "Value",
        ],
        assignString: [
            "Name",
            "WellContactName",
            "Material",
            "Region",
            "Model",
            "Parameter",
        ],
        others: {
            DopingWell: (k, v) => [`DopingWell(${v[0]} ${v[1]} ${v[2]})`],
            DopingWells: (k, v) => {
                if (typeof v === "string") {
                    return [`DopingWells(${v})`];
                }
                const vk = Object.keys(v)[0] as keyof typeof v;
                return [`DopingWells(${vk as string}="${v[vk]}")`];
            },
            MaterialInterface: (k, v) => [
                `MaterialInterface="${v[0]}/${v[1]}"`,
            ],
            RegionInterface: (k, v) => [`RegionInterface="${v[0]}/${v[1]}"`],
        },
    });

export { formatTransientGoal, formatQuasistationaryGoal };
