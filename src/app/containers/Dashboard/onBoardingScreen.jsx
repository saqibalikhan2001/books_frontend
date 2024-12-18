import { Link } from "react-router-dom";
import { NewOrganizationIcon } from "../../../assets/svg/NavigationIcons";
import { useStore } from "app/Hooks";

export default function InitialDashboardScreen() {
  const { role } = useStore();
  const { current_organization_id } = useStore();
  const seebizUrl = "seebiz.cloud";
  return (
    <div className="intital_screen d-flex w-100">
      <div className="left_section">
        <div className="onboarding-welcome--title">
          <p>On behalf of the SeeBiz team,</p>
          <p>welcome to SeeBiz Books.</p>
        </div>
        <div className="our_goal">
          <h2> Our goal is to help you manage your product easily.</h2>
        </div>

        <div className="listing_section">
          <ul>
            <li>
              <span>
                {role?.name === "Super Admin" && (
                  <Link to={`/organization-profile?org=${current_organization_id}`}>
                    <NewOrganizationIcon />
                    Update Organization detail
                  </Link>
                )}
              </span>
            </li>
            {/* <li>
              <span>
                <a href="/contacts/import">
                <NewContactIcon />
                Add or import your contacts
                </a>
              </span>
            </li>
            <li className="last">
              <span>
                <a href="/items/import">
                <NewItemIcon />
                Add or import existing items using CSV
                </a>
              </span>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="right_section no-data">
        <div className="information_section">
          <div className="information_section_title">
            <h1>What to expect from SeeBiz Books?</h1>
            <p>
              SeeBiz Books will help you to manage your contacts, products, orders, invoice, bills
              and much more. Take advantage our help section if you have any queries,If you have any
              custom questions then get in touch with us.
              {/* <a
                href={`https://www.${seebizUrl}/inventory/contact-us/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                help section
              </a>
              , if you have any queries. If you have any custom questions then
              <a
                href={`https://www.${seebizUrl}/inventory/contact-us/`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {" "}
                get in touch{" "}
              </a>
              with us. */}
            </p>
          </div>
        </div>

        <div className="video_section">
          <div className="video_section_inner">
            <h3>Analyzing Your Inventory Summary through Dashboard</h3>
            <iframe
              width="100%"
              height="445"
              src="https://www.youtube.com/embed/GP-egmkc074"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
