type AllKeys<T> = T extends any ? keyof T : never;

type FormatBatch<T extends Record<string, unknown>> = {
    flag?: AllKeys<T>[];
    switch?: AllKeys<T>[];
    assign?: AllKeys<T>[];
    assignString?: AllKeys<T>[];
    block?: { [K in keyof T]?: (v: NonNullable<T[K]>) => string[] };
    others?: { [K in keyof T]?: (k: K, v: NonNullable<T[K]>) => string[] };
};

const SDeviceFormat =
    <T extends Record<string, unknown>>(entity: T) =>
    (format: FormatBatch<T>) => {
        const retval: string[] = [];

        if (format.flag !== undefined) {
            const existing_flag = field_filter(entity, format.flag);
            retval.push(...(existing_flag as string[]));
        }
        if (format.switch !== undefined) {
            const existing_sw = field_filter(entity, format.switch);
            retval.push(
                ...(existing_sw as string[]).map(
                    (v) => (entity[v] ? "+" : "-") + v,
                ),
            );
        }
        if (format.assign !== undefined) {
            const existing_assign = field_filter(entity, format.assign);
            retval.push(
                ...(existing_assign as string[]).map(
                    (v) => `${v}=${entity[v]}`,
                ),
            );
        }
        if (format.assignString !== undefined) {
            const existing_assignString = field_filter(
                entity,
                format.assignString,
            );
            retval.push(
                ...(existing_assignString as string[]).map(
                    (v) => `${v}="${entity[v]}"`,
                ),
            );
        }
        if (format.block !== undefined) {
            const r = Object.entries(format.block)
                .filter(([k, v]) => v !== undefined && entity[k] !== undefined)
                .map(([k, v]) => {
                    const r: string[] = [k, "("];
                    r.push(...v(entity[k]));
                    r.push(")");
                    return r;
                });
            retval.push(...r.flat());
        }
        if (format.others !== undefined) {
            retval.push(
                ...Object.entries(format.others)
                    .filter(
                        ([k, v]) => v !== undefined && entity[k] !== undefined,
                    )
                    .map(([k, v]) => v(k, entity[k]))
                    .flat(),
            );
        }

        return retval;
    };

export default SDeviceFormat;

const field_filter = <T extends Record<string, unknown>>(
    e: T,
    fields: (keyof T)[],
) => fields.filter((v) => e[v] !== undefined);
