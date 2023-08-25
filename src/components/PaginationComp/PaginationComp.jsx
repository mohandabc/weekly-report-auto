import React, { useState } from 'react';
import { Pagination } from 'rsuite';
import { TsAnalysis } from '../../pages/Deliverables/Tabs/AnalysisForms/TsAnalysis';

const ITEMS_PER_PAGE = 1;

export const PaginationComp = ({ data }) => {
  const [activePage, setActivePage] = useState(1);

  const handleSelect = (eventKey) => {
    setActivePage(eventKey);
  };

  const startIndex = (activePage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedData = data.slice(startIndex, endIndex);

  return (
    <>
      <div className={`sticky rounded-xl bg-gray-200 dark:bg-stone-700 h-auto`}>
        {paginatedData.map((item) => (
          <TsAnalysis TsAnalysisData={item["ts_analysis"]} doc_id={item["_id"]}></TsAnalysis>
        ))}
        <div className="flex justify-center">
          <Pagination
            prev
            next
            first
            last
            size="md"
            maxButtons={10}
            activePage={activePage}
            pages={Math.ceil(data.length / ITEMS_PER_PAGE)}
            onSelect={handleSelect}
          />
        </div>
      </div>
    </>
  );
};