/**
 * Virtualization utilities
 * Renders only visible items for large lists
 */

import { useVirtualizer } from '@tanstack/react-virtual';
import { useRef } from 'react';

/**
 * Virtualization threshold - use virtual scrolling above this count
 */
export const VIRTUALIZATION_THRESHOLD = 50;

/**
 * Should virtualize based on item count
 */
export function shouldVirtualize(itemCount: number): boolean {
  return itemCount >= VIRTUALIZATION_THRESHOLD;
}

/**
 * Hook for virtualizing lists
 */
export function useListVirtualization<T>({
  items,
  estimateSize,
  overscan = 5,
}: {
  items: T[];
  estimateSize: number;
  overscan?: number;
}) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => estimateSize,
    overscan,
  });

  return {
    parentRef,
    virtualizer,
    virtualItems: virtualizer.getVirtualItems(),
    totalSize: virtualizer.getTotalSize(),
  };
}

/**
 * Hook for virtualizing grids
 */
export function useGridVirtualization<T>({
  items,
  columns,
  rowHeight,
  gap = 16,
  overscan = 3,
}: {
  items: T[];
  columns: number;
  rowHeight: number;
  gap?: number;
  overscan?: number;
}) {
  const parentRef = useRef<HTMLDivElement>(null);
  const rowCount = Math.ceil(items.length / columns);

  const virtualizer = useVirtualizer({
    count: rowCount,
    getScrollElement: () => parentRef.current,
    estimateSize: () => rowHeight + gap,
    overscan,
  });

  const virtualRows = virtualizer.getVirtualItems();

  // Calculate which items to render
  const visibleItems = virtualRows.flatMap((virtualRow) => {
    const startIndex = virtualRow.index * columns;
    const endIndex = Math.min(startIndex + columns, items.length);
    return items.slice(startIndex, endIndex).map((item, colIndex) => ({
      item,
      index: startIndex + colIndex,
      row: virtualRow.index,
      col: colIndex,
    }));
  });

  return {
    parentRef,
    virtualizer,
    virtualRows,
    visibleItems,
    totalSize: virtualizer.getTotalSize(),
  };
}

/**
 * Virtual scroll wrapper component
 */
interface VirtualScrollProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  itemHeight: number;
  className?: string;
  overscan?: number;
}

export function VirtualScroll<T>({
  items,
  renderItem,
  itemHeight,
  className = '',
  overscan = 5,
}: VirtualScrollProps<T>) {
  const { parentRef, virtualItems, totalSize } = useListVirtualization({
    items,
    estimateSize: itemHeight,
    overscan,
  });

  // If below threshold, render normally
  if (!shouldVirtualize(items.length)) {
    return (
      <div className={className}>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={parentRef} className={`overflow-auto ${className}`}>
      <div style={{ height: `${totalSize}px`, position: 'relative' }}>
        {virtualItems.map((virtualItem) => (
          <div
            key={virtualItem.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            {renderItem(items[virtualItem.index], virtualItem.index)}
          </div>
        ))}
      </div>
    </div>
  );
}

/**
 * Virtual grid wrapper component
 */
interface VirtualGridProps<T> {
  items: T[];
  renderItem: (item: T, index: number) => React.ReactNode;
  columns: number;
  rowHeight: number;
  gap?: number;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  renderItem,
  columns,
  rowHeight,
  gap = 16,
  className = '',
}: VirtualGridProps<T>) {
  const { parentRef, visibleItems, totalSize } = useGridVirtualization({
    items,
    columns,
    rowHeight,
    gap,
  });

  // If below threshold, render normally
  if (!shouldVirtualize(items.length)) {
    return (
      <div className={`grid ${className}`} style={{ gap: `${gap}px` }}>
        {items.map((item, index) => (
          <div key={index}>{renderItem(item, index)}</div>
        ))}
      </div>
    );
  }

  return (
    <div ref={parentRef} className={`overflow-auto ${className}`}>
      <div style={{ height: `${totalSize}px`, position: 'relative' }}>
        {visibleItems.map(({ item, index, row, col }) => (
          <div
            key={index}
            style={{
              position: 'absolute',
              top: `${row * (rowHeight + gap)}px`,
              left: `calc(${(col / columns) * 100}% + ${col * gap}px)`,
              width: `calc(${100 / columns}% - ${gap}px)`,
              height: `${rowHeight}px`,
            }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
    </div>
  );
}
