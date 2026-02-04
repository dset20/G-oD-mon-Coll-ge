
import React from 'react';

interface GeoGebraViewerProps {
  materialId: string;
}

export const GeoGebraViewer: React.FC<GeoGebraViewerProps> = ({ materialId }) => {
  return (
    <div className="w-full aspect-video border rounded-xl overflow-hidden bg-white shadow-sm">
      <iframe
        src={`https://www.geogebra.org/material/iframe/id/${materialId}/width/800/height/500/border/888888/sfsb/true/smb/false/stb/false/stbh/false/ai/false/asb/false/sri/false/rc/false/ld/false/sdz/false/ctl/false`}
        width="100%"
        height="100%"
        style={{ border: 'none' }}
        allowFullScreen
        title="Visualisation GeoGebra"
      />
    </div>
  );
};
