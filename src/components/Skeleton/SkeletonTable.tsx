"use client";

import SkeletonBox from "./SkeletonBox";

export default function SkeletonTable() {
  return (
    <div className="p-4 w-full">
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 !mb-5">
        {[...Array(3)].map((_, i) => (
          <SkeletonBox key={i} className="h-24 w-full" />
        ))}
      </div>

      {/* Table headers */}
      <div className="grid grid-cols-10 gap-2 text-sm font-medium text-gray-500 mt-4">
        <SkeletonBox className="col-span-1 h-10" />
        <SkeletonBox className="col-span-2 h-10" />
        <SkeletonBox className="col-span-1 h-10" />
        <SkeletonBox className="col-span-2 h-10" />
        <SkeletonBox className="col-span-1 h-10" />
        <SkeletonBox className="col-span-1 h-10" />
        <SkeletonBox className="col-span-1 h-10" />
        <SkeletonBox className="col-span-1 h-10" />
      </div>

      {/* Table rows */}
      {[...Array(5)].map((_, i) => (
        <div key={i} className="grid grid-cols-10 gap-2 items-center py-4">
          <SkeletonBox className="col-span-1 h-14 w-14 rounded" />
          <SkeletonBox className="col-span-2 h-4 w-3/4" />
          <SkeletonBox className="col-span-1 h-4 w-3/4" />
          <SkeletonBox className="col-span-2 h-4 w-full" />
          <SkeletonBox className="col-span-1 h-6 w-12 rounded-md" />
          <SkeletonBox className="col-span-1 h-4 w-1/2" />
          <SkeletonBox className="col-span-1 h-4 w-3/4" />
          <SkeletonBox className="col-span-1 h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
