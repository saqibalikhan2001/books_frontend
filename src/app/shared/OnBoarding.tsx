import { Fragment } from "react";
import { Link } from "react-router-dom";
import { ImportIcon, InfoIcon, PreferencesIcon } from "assets/svg";
import { PageHeaderX } from "./PageHeader";

export const Onboarding = ({
  FlowDiagram = () => null,
  description = "",
  buttonLabel = "",
  buttonLink = "/",
  videoFrame = "",
  DisplayIcon = null,
  headerTitle = "",
  secondaryButtonLabel = "",
  secondaryButtonLink = "/",
}: any) => (
  <Fragment>
    <PageHeaderX.SubHeader btnText={""} navigateTo={""} enabled={false} title={headerTitle} />
    <div className="intialscreen_innerpages d-flex">
      <div className="d-flex flex-md-column  w-100">
        <div className="left w-100">
          <div className="center_image">
            {videoFrame}
            <div className="our_goal">
              <h2>{description}</h2>
            </div>
            <div className="actions_buttons">
              <div className="d-flex">
                {buttonLabel && (
                  <Link to={buttonLink} className="">
                    <DisplayIcon />
                    <span> {buttonLabel}</span>
                  </Link>
                )}
              </div>
              <div className="float-left w-100">
                {secondaryButtonLabel && (
                  <Link to={secondaryButtonLink} className="">
                    <ImportIcon />
                    {secondaryButtonLabel}
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="right w-100">
          <div className="d-flex justify-center items_flow">
            <div className="center_image">
              <FlowDiagram />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Fragment>
);

export const Header = ({
  Icon = () => null,
  title = "",
  subtitle = "",
  className = "",
  children,
  showModal,
  fromDashboard = false,
  iconStyle = "",
}: any) => (
  <div className={`top-header ${className}`}>
    <span className="layout--title ellipsis">
      <Icon className={iconStyle} />
      <PreferencesIcon />
      <h3>
        {title && title} {subtitle && "/"} <span className="semi-bold">{subtitle}</span>
      </h3>
    </span>
    {fromDashboard && (
      <button onClick={showModal} className="button--primary dash float-left flex">
        <InfoIcon />
        {/* <MdAdd /> */}
        View Updates
      </button>
    )}
    {children}
  </div>
);
