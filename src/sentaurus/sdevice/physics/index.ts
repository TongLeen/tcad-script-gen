import { formatMobility, type Mobility } from "./mobility";
import { formatRecombination, type Recombination } from "./recombination";
import {
    formatAniso,
    formatBarrierTunneling,
    formatEffectiveIntrinsicDensity,
    formatIncompleteIonization,
    type Aniso,
    type BarrierTunneling,
    type EffectiveIntrinsicDensity,
    type IncompleteIonization,
} from "./misc";
import { formatTrap, type Trap } from "./trap";
import SDeviceFormat from "../format";

type PhysicsType<M extends string, D extends string> = (
    | PhysicsConfigGlobal
    | PhysicsConfigMaterial<M>
    | PhysicsConfigRegion<M>
    | PhysicsConfigMaterialInterface<M>
    | PhysicsConfigRegionInterface<M>
    | PhysicsConfigContact
) &
    PhysicsConfigCommon<D>;

type PhysicsConfigMaterial<M extends string> = {
    kind: "Material";
    material: M;
} & PhysicsConfigBulk<M>;

type PhysicsConfigRegion<M extends string> = {
    kind: "Region";
    region: string;
} & PhysicsConfigBulk<M>;

type PhysicsConfigMaterialInterface<M extends string> = {
    kind: "MaterialInterface";
    materials: [M, M];
} & PhysicsConfigInterface<M>;

type PhysicsConfigRegionInterface<M extends string> = {
    kind: "RegionInterface";
    regions: [string, string];
} & PhysicsConfigInterface<M>;

type PhysicsConfigContact = {
    kind: "Contact";
    contact: string;
    BarrierLowering?: true;
};

const formatContact = (raw: PhysicsConfigContact) => {
    return raw.BarrierLowering ? ["BarrierLowering"] : [];
};

type PhysicsConfigCommon<D extends string> = {
    Recombination?: Recombination;
    Aniso?: Aniso;
    IncompleteIonization?: IncompleteIonization<D>;
    BreakdownProbability?: {
        InterpolatedDiscretization?: true;
        MinElectricField?: number;
    };
    Piezoelectric_Polarization?: {
        force: "strain" | "stress";
        activation?: number;
    };
    LatticeTemperatureLimit?: number;
};

const formatCommon = <D extends string>(raw: PhysicsConfigCommon<D>) =>
    SDeviceFormat(raw)({
        assign: ["LatticeTemperatureLimit"],
        block: {
            Recombination: formatRecombination,
            Aniso: formatAniso,
            IncompleteIonization: formatIncompleteIonization,
            BreakdownProbability: (e) =>
                SDeviceFormat(e)({
                    flag: ["InterpolatedDiscretization"],
                    assign: ["MinElectricField"],
                }),
            Piezoelectric_Polarization: (e) =>
                SDeviceFormat(e)({
                    assign: ["activation"],
                    others: { force: (_, v) => [v] },
                }),
        },
    });

type PhysicsConfigGlobal = {
    kind: "Global";
    DefaultParametersFromFile?: true;
    AreaFactor?: number;

    Thermodynamic?: true | "HLLTunnelingRecGenHeat";
    Temperature?: number;
    PostTemperature?: true | { IV_diss: true | string };

    Hydrodynamic?: true | "eTemperature" | "hTemperature";

    eBarrierTunneling?: Record<string, BarrierTunneling | null>;
    hBarrierTunneling?: Record<string, BarrierTunneling | null>;

    Fermi?: true | "-WithJoyceDixon" | "WithFukushima";
    FermiForTEPAnalytic?: true;
};

const formatGlobal = (raw: PhysicsConfigGlobal) =>
    SDeviceFormat(raw)({
        flag: ["DefaultParametersFromFile", "FermiForTEPAnalytic"],
        assign: ["AreaFactor", "Temperature"],
        block: {
            Fermi: (e) => (e === true ? [] : [e]),
            Thermodynamic: (e) => (e === true ? [] : [e]),
            PostTemperature: (e) => {
                if (e === true) return [];
                const { IV_diss } = e;
                if (IV_diss === true) return ["IV_diss"];
                else return [`IV_diss(${IV_diss})`];
            },
            Hydrodynamic: (e) => (e === true ? [] : [e]),
        },
        others: {
            eBarrierTunneling: (k, v) => {
                const r: string[] = [];
                Object.entries(v).forEach(([name, ebt]) => {
                    r.push(k, `"${name}"`);
                    if (ebt) r.push("(", ...formatBarrierTunneling(ebt), ")");
                });
                return r;
            },
            hBarrierTunneling: (k, v) => {
                const r: string[] = [];
                Object.entries(v).forEach(([name, ebt]) => {
                    r.push(k, `"${name}"`);
                    if (ebt) r.push("(", ...formatBarrierTunneling(ebt), ")");
                });
                return r;
            },
        },
    });

type PhysicsConfigBulk<M extends string> = {
    EffectiveIntrinsicDensity?: EffectiveIntrinsicDensity;

    Mobility?: Mobility;
    eMobility?: Mobility;
    hMobility?: Mobility;

    eQuasiFermi?: number;
    hQuasiFermi?: number;

    Traps?: Trap<"Bulk", M>[];

    GaussianDOS_full?: true;
    HeatPreFactor?: number;
    TEPower?: "Analytic" | "Tabulated_Si";
};

const formatBulk = <M extends string>(raw: PhysicsConfigBulk<M>) =>
    SDeviceFormat(raw)({
        flag: ["GaussianDOS_full"],
        assign: ["eQuasiFermi", "hQuasiFermi", "HeatPreFactor"],
        block: {
            EffectiveIntrinsicDensity: formatEffectiveIntrinsicDensity,
            Mobility: formatMobility,
            eMobility: formatMobility,
            hMobility: formatMobility,
            Traps: (e) =>
                e
                    .map(formatTrap)
                    .map((v) => ["(", ...v, ")"])
                    .flat(),
            TEPower: (e) => [e],
        },
    });

type PhysicsConfigInterface<M extends string> = {
    Dipole?: true;
    DistResist?: DistResist;
    MSDistResist?: DistResist;

    Traps?: Trap<"Interface", M>[];

    eRecVelocity?: number;
    hRecVelocity?: number;

    HeteroInterface?: true;

    Schottky?: true;
    Schroedinger?: true;

    TATNonlocalPathNC?: number;
    Thermionic?: true | "HCI" | "Organic_Gaussian";
};
type DistResist = number | "SchottkyResist";

const formatInterface = <M extends string>(raw: PhysicsConfigInterface<M>) =>
    SDeviceFormat(raw)({
        flag: ["Dipole", "HeteroInterface", "Schottky", "Schroedinger"],
        assign: [
            "DistResist",
            "MSDistResist",
            "eRecVelocity",
            "hRecVelocity",
            "TATNonlocalPathNC",
        ],
        block: {
            Traps: (e) =>
                e
                    .map(formatTrap)
                    .map((v) => ["(", ...v, ")"])
                    .flat(),
            Thermionic: (e) => (e === true ? [] : [e]),
        },
    });

const physicsGenerator = <M extends string, D extends string>(
    ctx: string[],
) => {
    const phy = (p: PhysicsType<M, D>) => {
        const retval: string[] = ["Physics"];
        switch (p.kind) {
            case "Global":
                retval.push("{", ...formatGlobal(p));
                break;
            case "Region":
                retval.push(`(Region="${p.region}")`);
                retval.push("{", ...formatBulk(p));
                break;
            case "RegionInterface":
                retval.push(`(RegionInterface="${p.regions.join("/")}")`);
                retval.push("{", ...formatInterface(p));
                break;
            case "Contact":
                retval.push(`(Contact="${p.contact}")`);
                retval.push("{", ...formatContact(p));
                break;
            case "Material":
                retval.push(`(Material="${p.material}")`);
                retval.push("{", ...formatBulk(p));
                break;
            case "MaterialInterface":
                retval.push(`(MaterialInterface="${p.materials.join("/")}")`);
                retval.push("{", ...formatInterface(p));
                break;
        }
        retval.push(...formatCommon(p), "}");
        ctx.push(...retval);
    };
    return phy;
};

export { physicsGenerator };
export type { PhysicsType };
