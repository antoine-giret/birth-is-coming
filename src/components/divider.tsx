import React from 'react';

export default function Divider({ text }: { text?: React.ReactNode }) {
  return (
    <div className="relative border-t border-gray-100">
      {text && (
        <div className="absolute left-0 -top-3 w-full flex justify-center">
          <div className="bg-white px-2.5 text-sm text-gray-500">{text}</div>
        </div>
      )}
    </div>
  );
}
