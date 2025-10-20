"use client";

import React from "react";

type BravoDealInfoProps = {
  description: string; // HTML string from DB
};

const BravoDealInfo: React.FC<BravoDealInfoProps> = ({ description }) => {
  return (
    <div className="max-w-[1090px] mx-auto mt-10 px-4 sm:px-6 md:px-8 py-8 bg-gray-100 rounded-lg shadow-md text-gray-800">
      {/* Render dynamic description */}
      <div
        className="prose text-gray-800"
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default BravoDealInfo;
