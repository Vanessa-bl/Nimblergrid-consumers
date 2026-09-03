export type DocProp = {
  name: string;
  description: string;
  required?: boolean;
};

export function PropsTable({ props }: Readonly<{ props: readonly DocProp[] }>) {
  if (props.length === 0) return null;
  return (
    <div className="mt-5 overflow-hidden rounded-xl border border-zinc-200">
      <table className="w-full border-collapse text-left">
        <thead className="bg-zinc-50 text-[11px] uppercase tracking-[0.08em] text-zinc-500">
          <tr>
            <th scope="col" className="px-3 py-2 font-semibold">
              Prop
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              Qué hace
            </th>
            <th scope="col" className="px-3 py-2 font-semibold">
              Requerida
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-100 text-[13px]">
          {props.map((prop) => (
            <tr key={prop.name}>
              <td className="w-44 px-3 py-2 align-top font-mono text-[12.5px] text-rose-600">
                {prop.name}
              </td>
              <td className="px-3 py-2 align-top text-zinc-600">
                {prop.description}
              </td>
              <td className="w-20 px-3 py-2 align-top">
                {prop.required ? (
                  <span className="inline-flex rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                    Sí
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                    No
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
