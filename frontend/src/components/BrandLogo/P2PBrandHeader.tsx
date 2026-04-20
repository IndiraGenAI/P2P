import React from "react";
import p2pLogo from "../../assets/images/p2p-logo.png";

type P2PBrandHeaderProps = {
  /** Logo image width in pixels */
  logoWidth?: number;
  /** When true, use light subtitle (e.g. on dark sider) */
  subtitleLight?: boolean;
  className?: string;
};

const taglineStyle = (light: boolean): React.CSSProperties => ({
  display: "block",
  marginTop: 8,
  fontSize: 14,
  fontWeight: 500,
  letterSpacing: "0.02em",
  color: light ? "rgba(255,255,255,0.85)" : "#e85d4a",
});

/**
 * P2P product mark: logo image + "Procure-to-Pay" tagline.
 */
const P2PBrandHeader: React.FC<P2PBrandHeaderProps> = ({
  logoWidth = 140,
  subtitleLight = false,
  className,
}) => {
  return (
    <div className={className} style={{ textAlign: "center" }}>
      <img
        src={p2pLogo}
        alt="P2P"
        title="P2P"
        width={logoWidth}
        style={{ maxWidth: "100%", height: "auto", display: "inline-block" }}
      />
      <span style={taglineStyle(subtitleLight)}>Procure-to-Pay</span>
    </div>
  );
};

export default P2PBrandHeader;
