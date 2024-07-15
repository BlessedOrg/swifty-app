import { Column } from "react-table";

export const columnsDataComplex = [
  {
    Header: "NAME",
    accessor: "name",
  },
  {
    Header: "SOLD OUT",
    accessor: "soldOut",
  },
  {
    Header: "Avg. TICKET PRICE",
    accessor: "avgTicketPrice",
  },
  {
    Header: "SELL PROGRESS",
    accessor: "progress",
  },
];



export type ColumnData = Column[];

export type TableData = Column<{
  name?: (string | boolean)[];
  date?: string;
  progress?: number;
  quantity?: number;
  status?: string;
  artworks?: string;
  rating?: number;
  amount?: number;
  type?: string;
}>;

export type TableProps = {
  columnsData: ColumnData;
  tableData: TableData[] | any;
  title?: string;
  creatorId?: number;
};
