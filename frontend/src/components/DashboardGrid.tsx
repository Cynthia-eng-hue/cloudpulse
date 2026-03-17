import React from 'react';
import { Responsive, useContainerWidth, type Layout } from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

interface DashboardGridProps {
  children: React.ReactNode;
  layout: Layout;
  onLayoutChange: (currentLayout: Layout, allLayouts: any) => void;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ children, layout, onLayoutChange }) => {
  const { width, containerRef, mounted } = useContainerWidth();

  return (
    <div ref={containerRef} className="w-full h-full min-h-[500px]">
      {mounted && (
        <Responsive
          width={width}
          className="layout"
          layouts={{ lg: layout }}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={100}
          onLayoutChange={onLayoutChange}
        >

          {children}
        </Responsive>
      )}
    </div>
  );
};

export default DashboardGrid;


