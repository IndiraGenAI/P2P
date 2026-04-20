import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  NAV_STYLE_DRAWER,
  NAV_STYLE_FIXED,
  NAV_STYLE_MINI_SIDEBAR,
  NAV_STYLE_NO_HEADER_MINI_SIDEBAR,
  TAB_SIZE,
  THEME_TYPE_LITE,
} from "../../constants/ThemeSetting";

const SidebarLogo = ({ sidebarCollapsed, setSidebarCollapsed }) => {
  const { width, themeType } = useSelector(({ settings }) => settings);
  let navStyle = useSelector(({ settings }) => settings.navStyle);
  if (width < TAB_SIZE && navStyle === NAV_STYLE_FIXED) {
    navStyle = NAV_STYLE_DRAWER;
  }
  return (
    <div className="gx-layout-sider-header">
      {navStyle === NAV_STYLE_FIXED || navStyle === NAV_STYLE_MINI_SIDEBAR ? (
        <div className="gx-linebar">
          <i
            className={`gx-icon-btn icon icon-${
              !sidebarCollapsed ? "menu-unfold" : "menu-fold"
            } ${themeType !== THEME_TYPE_LITE ? "gx-text-white" : ""}`}
            onClick={() => {
              setSidebarCollapsed(!sidebarCollapsed);
            }}
          />
        </div>
      ) : null}

      <Link
        to="/"
        className="gx-site-logo"
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textDecoration: "none",
          padding: "4px 0",
        }}
      >
        <img
          alt="P2P"
          src={"/assets/images/p2p-logo.png"}
          style={{
            maxWidth:
              navStyle === NAV_STYLE_NO_HEADER_MINI_SIDEBAR && width >= TAB_SIZE
                ? 48
                : 120,
            height: "auto",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            marginTop: 4,
            letterSpacing: "0.02em",
            color:
              themeType === THEME_TYPE_LITE ? "#e85d4a" : "rgba(255,255,255,0.9)",
          }}
        >
          Procure-to-Pay
        </span>
      </Link>
    </div>
  );
};

export default SidebarLogo;
