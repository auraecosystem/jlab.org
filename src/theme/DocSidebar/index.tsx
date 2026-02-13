import React from 'react';
import OriginalDocSidebar from '@theme-original/DocSidebar';
import type { Props } from '@theme/DocSidebar';

export default function DocSidebarWrapper(props: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Original sidebar */}
      <div style={{ flex: '1 1 auto' }}>
        <OriginalDocSidebar {...props} />
      </div>
    </div>
  );
}
