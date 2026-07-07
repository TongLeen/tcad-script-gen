type KeysWithValue<T, V> = {
    [K in keyof T]: T[K] extends V ? K : never;
}[keyof T];

const useFormatUtils = (ctx: string[]) => {
    const formatFlag =
        <T extends Record<string, unknown>, G extends KeysWithValue<T, true | undefined>>(raw: T, field: G) => {
            const v = raw[field] as true | undefined
            if (v !== undefined) ctx.push(field as string)
        }
    const formatSwitch =
        <T extends Record<string, unknown>, G extends KeysWithValue<T, boolean | undefined>>(raw: T, field: G) => {
            const v = raw[field] as boolean | undefined
            if (v !== undefined) ctx.push((v ? '+' : '-') + (field as string))
        }
    const formatAssignment =
        <T extends Record<string, unknown>, G extends KeysWithValue<T, number | string | undefined>>(
            raw: T, field: G, formatter?: (k: G, v: NonNullable<T[G]>) => string,
        ) => {
            const v = raw[field]
            if (v !== undefined && v !== null) {
                if (formatter !== undefined) ctx.push(formatter(field, v))
                else ctx.push(`${field as string}=${v}`)
            }
        }
    const formatBlock =
        <T extends Record<string, unknown>, G extends KeysWithValue<T, unknown>>(
            raw: T, field: G, formatter: (raw: NonNullable<T[G]>) => string[],
        ) => {
            const v = raw[field]
            if (v !== undefined && v !== null) ctx.push(
                field as string,
                "(",
                ...formatter(v),
                ")",
            )
        }


    return {
        formatFlag,
        formatSwitch,
        formatAssignment,
        formatBlock,
    }
}

export default useFormatUtils;