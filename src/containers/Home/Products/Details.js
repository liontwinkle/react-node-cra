import React from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CustomSection } from 'components/elements';
import ExportDataSection from 'components/ProductDetail/exportData';
import './style.scss';
import CalcAverage from 'components/ProductDetail/calcAverage';
import ShowFields from 'components/ProductDetail/showFields';

function ProductsDetail() {
  return (
    <PerfectScrollbar
      options={{
        suppressScrollX: true,
        minScrollbarLength: 50,
      }}
    >
      <div className="product-details">
        <CustomSection title="Export and Save" key="export_save">
          <ExportDataSection />
        </CustomSection>
        <CustomSection title="Export and Save" key="export_save">
          <CalcAverage />
        </CustomSection>
        <CustomSection title="Export and Save" key="export_save">
          <ShowFields />
        </CustomSection>
      </div>
    </PerfectScrollbar>
  );
}

export default ProductsDetail;
