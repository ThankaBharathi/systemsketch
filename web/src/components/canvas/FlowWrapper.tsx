'use client';

export default function FlowWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        minHeight: '600px',
        position: 'relative',
      }}
    >
      {children}
    </div>
  );
}
