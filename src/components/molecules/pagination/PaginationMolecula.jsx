import React from "react";
import { Pagination } from "@nextui-org/react";

const PaginationMolecula = ({ total, initialPage, onChange }) => {
  return (
    <div className="w-full justify-center flex">
      <Pagination
        loop
        showControls
        color="success"
        className="flex-wrap flex "
        total={total}
        initialPage={initialPage}
        onChange={(pagina) => onChange(pagina)}
      />
    </div>
  );
};

export default PaginationMolecula;
