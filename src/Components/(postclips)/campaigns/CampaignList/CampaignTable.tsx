import {
  campaignListColumns,
  campaignListTableData,
} from "@/Components/(postclips)/campaigns/CampaignList/CampaignData";
import { ProductListType } from "@/Types/ECommerce.type";
import React, { useState } from "react";
import DataTable from "react-data-table-component";
import FilterComponent from "@/Components/(postclips)/general/FilterComponent";

const CampaignTable = () => {
  const [filterText, setFilterText] = useState("");
  const filteredItems: ProductListType[] = campaignListTableData.filter(
    (item: ProductListType) => {
      return Object.values(item).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(filterText.toLowerCase())
      );
    }
  );
  return (
    <div className="list-product">
      <FilterComponent
        onFilter={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFilterText(e.target.value)
        }
        filterText={filterText}
      />
      <DataTable
        className="custom-scrollbar"
        data={filteredItems}
        columns={campaignListColumns}
        pagination
      />
    </div>
  );
};
export default CampaignTable;
