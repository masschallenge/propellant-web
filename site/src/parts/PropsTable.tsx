import { Table } from '../../../src/index';
import type { PropEntry } from '../../tooling/components';

export const PropsTable = ({ props, caption }: { props: PropEntry[]; caption: string }) =>
  props.length ? (
    <div className="min-w-0 overflow-x-auto">
      <Table
        caption={caption}
        size="sm"
        rows={props}
        rowId={(prop) => prop.name}
        columns={[
          {
            key: 'name',
            header: 'Prop',
            cell: (prop) => (
              <code className="font-[family-name:var(--type-family-mono)] text-footnote font-semibold text-[var(--label)] whitespace-nowrap">
                {prop.name}
                {prop.optional ? null : <span className="text-[var(--critical)]"> required</span>}
              </code>
            ),
          },
          {
            key: 'type',
            header: 'Type',
            cell: (prop) => (
              <code className="font-[family-name:var(--type-family-mono)] text-footnote text-[var(--label-secondary)] [overflow-wrap:anywhere]">
                {prop.type}
              </code>
            ),
          },
          {
            key: 'default',
            header: 'Default',
            cell: (prop) =>
              prop.defaultValue ? (
                <code className="font-[family-name:var(--type-family-mono)] text-footnote text-[var(--label)] [overflow-wrap:anywhere]">
                  {prop.defaultValue}
                </code>
              ) : (
                <span className="text-footnote text-[var(--label-tertiary)]">None</span>
              ),
          },
        ]}
      />
    </div>
  ) : (
    <p className="m-0 text-callout text-[var(--label-secondary)]">
      Takes no props of its own beyond standard HTML attributes.
    </p>
  );
