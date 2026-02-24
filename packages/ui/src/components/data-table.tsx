import * as React from "react";
import { cn } from "../lib/utils";

/**
 * Definição de coluna da tabela
 */
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
  width?: string;
  align?: "left" | "center" | "right";
  render?: (value: any, row: Record<string, any>) => React.ReactNode;
}

export interface DataTableProps extends React.TableHTMLAttributes<HTMLTableElement> {
  /** Colunas da tabela */
  columns: TableColumn[];
  /** Dados a renderizar */
  data: Record<string, any>[];
  /** Chave de ordenação atual */
  sortKey?: string;
  /** Direção de ordenação */
  sortDirection?: "asc" | "desc";
  /** Callback ao clicar em ordenar */
  onSort?: (key: string) => void;
  /** Se true, mostra zebra-striping */
  striped?: boolean;
  /** Se true, mostra hover effect */
  hoverable?: boolean;
  /** Mensagem quando não há dados */
  emptyMessage?: string;
  /** Função para gerar chave única da linha */
  getRowKey?: (row: Record<string, any>, index: number) => string;
}

/**
 * Componente Table (organism)
 * Compõe TableHeader, TableBody, TableRow, TableCell
 */
const DataTable = React.forwardRef<HTMLTableElement, DataTableProps>(
  (
    {
      className,
      columns,
      data,
      sortKey,
      sortDirection,
      onSort,
      striped,
      hoverable = true,
      emptyMessage = "Nenhum dado disponível",
      getRowKey,
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative w-full overflow-auto border rounded-lg">
        <table
          ref={ref}
          className={cn("w-full caption-bottom text-sm", className)}
          role="grid"
          {...props}
        >
          <TableHeader
            columns={columns}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={onSort}
          />
          <TableBody
            columns={columns}
            data={data}
            striped={striped}
            hoverable={hoverable}
            emptyMessage={emptyMessage}
            getRowKey={getRowKey}
          />
        </table>
      </div>
    );
  }
);
DataTable.displayName = "DataTable";

/**
 * TableHeader: Renderiza cabeçalho com suporte a sorting
 */
interface TableHeaderProps {
  columns: TableColumn[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
}

const TableHeader = React.forwardRef<HTMLTableSectionElement, TableHeaderProps>(
  ({ columns, sortKey, sortDirection, onSort }, ref) => {
    return (
      <thead
        ref={ref}
        className="border-b bg-muted/50"
        role="row"
      >
        <tr>
          {columns.map((column) => (
            <th
              key={column.key}
              className={cn(
                "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=button])]:pr-0",
                column.align === "center" && "text-center",
                column.align === "right" && "text-right",
                column.width && `w-[${column.width}]`
              )}
              style={column.width ? { width: column.width } : undefined}
              role="columnheader"
            >
              {column.sortable ? (
                <button
                  onClick={() => onSort?.(column.key)}
                  className="flex items-center gap-2 cursor-pointer hover:text-foreground transition-colors select-none"
                  title={`Ordenar por ${column.label}`}
                >
                  {column.label}
                  {sortKey === column.key && (
                    <svg
                      className={cn(
                        "w-4 h-4 transition-transform",
                        sortDirection === "desc" ? "rotate-180" : ""
                      )}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 14l-7 7m0 0l-7-7m7 7V3"
                      />
                    </svg>
                  )}
                </button>
              ) : (
                column.label
              )}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
);
TableHeader.displayName = "TableHeader";

/**
 * TableBody: Renderiza linhas de dados
 */
interface TableBodyProps {
  columns: TableColumn[];
  data: Record<string, any>[];
  striped?: boolean;
  hoverable?: boolean;
  emptyMessage?: string;
  getRowKey?: (row: Record<string, any>, index: number) => string;
}

const TableBody = React.forwardRef<HTMLTableSectionElement, TableBodyProps>(
  (
    {
      columns,
      data,
      striped,
      hoverable,
      emptyMessage,
      getRowKey,
    },
    ref
  ) => {
    if (data.length === 0) {
      return (
        <tbody ref={ref}>
          <tr>
            <td
              colSpan={columns.length}
              className="h-24 text-center text-muted-foreground"
            >
              {emptyMessage}
            </td>
          </tr>
        </tbody>
      );
    }

    return (
      <tbody ref={ref} className="[&_tr:last-child]:border-0">
        {data.map((row, index) => (
          <TableRow
            key={getRowKey ? getRowKey(row, index) : index}
            columns={columns}
            data={row}
            striped={striped && index % 2 !== 0}
            hoverable={hoverable}
          />
        ))}
      </tbody>
    );
  }
);
TableBody.displayName = "TableBody";

/**
 * TableRow: Linha individual
 */
interface TableRowProps {
  columns: TableColumn[];
  data: Record<string, any>;
  striped?: boolean;
  hoverable?: boolean;
}

const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ columns, data, striped, hoverable }, ref) => {
    return (
      <tr
        ref={ref}
        className={cn(
          "border-b transition-colors",
          striped && "bg-muted/40",
          hoverable && "hover:bg-muted/60"
        )}
        role="row"
      >
        {columns.map((column) => (
          <TableCell
            key={column.key}
            column={column}
            value={data[column.key]}
            row={data}
          />
        ))}
      </tr>
    );
  }
);
TableRow.displayName = "TableRow";

/**
 * TableCell: Célula individual
 */
interface TableCellProps {
  column: TableColumn;
  value: any;
  row: Record<string, any>;
}

const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ column, value, row }, ref) => {
    const content = column.render ? column.render(value, row) : value;

    return (
      <td
        ref={ref}
        className={cn(
          "px-4 py-3 align-middle",
          column.align === "center" && "text-center",
          column.align === "right" && "text-right",
          column.width && `w-[${column.width}]`
        )}
        style={column.width ? { width: column.width } : undefined}
        role="cell"
      >
        {content}
      </td>
    );
  }
);
TableCell.displayName = "TableCell";

export {
  DataTable,
  TableHeader,
  TableBody,
  TableRow,
  TableCell,
};
