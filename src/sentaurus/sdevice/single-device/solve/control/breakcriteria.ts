type ContactBreakCriteria = {
    contact: string;
    absval?: number;
    minval?: number;
    maxval?: number;
};
type BulkBreakCriteria = {
    maxval: number;
};
type PowerBreakCriteria = {
    absval?: number;
    minval?: number;
    maxval?: number;
};

type BreakCriteria = {
    Voltage?: ContactBreakCriteria;
    Current?: ContactBreakCriteria;
    CurrentDensity?: BulkBreakCriteria;
    ElectricField?: BulkBreakCriteria;
    LatticeTemperature?: BulkBreakCriteria;
    OuterDevicePower?: PowerBreakCriteria;
    InnerDevicePower?: PowerBreakCriteria;
};

export type { BreakCriteria };

import SDeviceFormat from "../../../utils/format";

const formatContactBreakCriteria = (c: ContactBreakCriteria) =>
    SDeviceFormat(c)({
        assign: ["absval", "minval", "maxval"],
        assignString: ["contact"],
    });

const formatBulkBreakCriteria = (b: BulkBreakCriteria) =>
    SDeviceFormat(b)({
        assign: ["maxval"],
    });

const formatPowerBreakCriteria = (p: PowerBreakCriteria) =>
    SDeviceFormat(p)({
        assign: ["absval", "minval", "maxval"],
    });

const formatBreakCriteria = (b: BreakCriteria) =>
    SDeviceFormat(b)({
        block: {
            Voltage: formatContactBreakCriteria,
            Current: formatContactBreakCriteria,
            CurrentDensity: formatBulkBreakCriteria,
            ElectricField: formatBulkBreakCriteria,
            LatticeTemperature: formatBulkBreakCriteria,
            OuterDevicePower: formatPowerBreakCriteria,
            InnerDevicePower: formatPowerBreakCriteria,
        },
    });

export { formatBreakCriteria };
