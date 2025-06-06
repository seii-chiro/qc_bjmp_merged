import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import React, { Suspense } from "react";
import Spinner from "./components/loaders/Spinner.tsx";
import GeneralErrorElement from "./pages/error_pages/GeneralErrorElement.tsx";
import { useAuthStore } from "./store/useAuthStore.ts";
import { MapContent } from "./map/MapContent.tsx";
import Landing from "./pages/landing/Home.tsx";
import Assets from "./pages/assets/assets.tsx";
import JailFacility from "./pages/assets/jail-facility/jailfacility.tsx";
import Annex from "./pages/assets/Annex/annex.tsx";
import Level from "./pages/assets/Level/level.tsx";
import Dorm from "./pages/assets/Dorm/dorm.tsx";
import JailArea from "./pages/facility_management/Jail-Area/jailarea.tsx";
import JailType from "./pages/facility_management/Jail-Type/Jail_Type.tsx";
import JailCategory from "./pages/facility_management/Jail-Category/jailcategory.tsx";
import JailSecurityLevel from "./pages/facility_management/jail-security-level/Jailsecuritylevel.tsx";
import Device from "./pages/devices-management/devices/Devices.tsx";
import DeviceType from "./pages/devices-management/devices-type/DevicesType.tsx";
import DeviceUsage from "./pages/devices-management/devices-usage/devicesusage.tsx";
import Maintenance from "./pages/maintenance/maintenance.tsx";
import RecordStatus from "./pages/maintenance/record_status/recordstatus.tsx";
import SocialMedia from "./pages/maintenance/social_media_platform/socialmedia.tsx";
import Gender from "./pages/personnel_management/gender/gender.tsx";
import CivilStatus from "./pages/personnel_management/civil-status/civilstatus.tsx";
import ID_Types from "./pages/personnel_management/ID_type/idtype.tsx";
import GeneralSetting from "./pages/Settings/generalsetting.tsx";
import User from "./pages/User_Management/User.tsx";
import Users from "./pages/User_Management/User/User.tsx";
import Roles from "./pages/User_Management/Roles/Roles.tsx";
import RoleLevel from "./pages/User_Management/RolesLevel/roleslevel.tsx";
import Tools from "./pages/tools/Tools.tsx";
import Integration from "./pages/Integration/Integration.tsx";
import Support from "./pages/support/Support.tsx";
import Report from "./pages/reports/Report.tsx";
import Incidents from "./pages/Incidents/Incidents.tsx";
import Threat from "./pages/threat/Threat.tsx";
import Screening from "./pages/screening/Screening.tsx";
import PDL from "./pages/pdl_management/PDL.tsx";
import PDLs from "./pages/pdl_management/pdl-information/PDLs.tsx";
import Visitors from "./pages/visitor_management/visitors.tsx";
import VisitorType from "./pages/visitor_management/visitor-type/visitortype.tsx";
import VisitorReqDocs from "./pages/visitor_management/visitor_requirement_docs/visitorreqdocs.tsx";
import VisitorRelationship from "./pages/visitor_management/visitor_relationship/visitor_relationship.tsx";
import Rank from "./pages/personnel_management/rank/rank.tsx";
import Position from "./pages/personnel_management/position/position.tsx";
import EmploymentType from "./pages/personnel_management/employment_type/EmploymentType.tsx";
import AffiliationType from "./pages/personnel_management/affiliation-type/AffiliationType.tsx";
import Home1 from "./pages/home/Home.tsx";
import Personnels from "./pages/personnel_management/Personnel.tsx";
import Personnel from "./pages/personnel_management/personnel/personnel.tsx";
import Home2 from "./pages/home/Home2/Home.tsx";
import Database from "./pages/database/database.tsx";
import VisitorRegistration from "./pages/visitor_management/visitor-data-entry/visitorregistration.tsx";
import Dashboard from "./pages/dashboard/Dashboard.tsx";
import VisitorCodeIdentification from "./pages/visitor_management/VisitorCodeIdentification.tsx";
import Issues from "./pages/visitor_management/issues.tsx";
import Visitor from "./pages/visitor_management/visitor.tsx";
import IdentificationLandscape from "./pages/LOG/visitor-profiles/visitorIdentityLandscape.tsx";
import Skills from "./pages/pdl_management/Skills/Skills.tsx";
import Talents from "./pages/pdl_management/Talents/Talents.tsx";
import Religion from "./pages/maintenance/Religion/Religion.tsx";
import Ethnicity from "./pages/maintenance/ethnicity/Ethnicity.tsx";
import Court from "./pages/database/JudicialCourt/Court.tsx";
import Interest from "./pages/database/Interest/Interest.tsx";
import Looks from "./pages/pdl_management/Look/look.tsx";
import Registration from "./pages/Registration/registration.tsx";
import LogMonitoring from "./pages/LOG/LogMonitoring.tsx";
import VisitLog from "./pages/LOG/Visit-Log/VisitLog.tsx";
import CourtBranch from "./pages/pdl_management/Court-Branch/CourtBranch.tsx";
import Occupation from "./pages/maintenance/Occupation/Occupation.tsx";
import EducationalAttainment from "./pages/maintenance/Educational-Attainment/EducationalAttainment.tsx";
import Prefixes from "./pages/maintenance/Prefixes/Prefixes.tsx";
import Suffixes from "./pages/maintenance/Suffixes/Suffixes.tsx";
import ContactType from "./pages/maintenance/Contact/contact.tsx";
import AddressType from "./pages/maintenance/Address/AddressType.tsx";
import Nationality from "./pages/maintenance/Nationality/Nationality.tsx";
import BJMPPersonnel from "./pages/Registration/BJMPPersonnel/BJMPPersonnel.tsx";
import MultiBirth from "./pages/maintenance/Multi-Birth/MultiBirth.tsx";
import PdlRegistration from "./pages/visitor_management/pdl-data-entry/PdlRegistration.tsx";
import PersonnelRegistration from "./pages/visitor_management/personnel-data-entry/PersonnelRegistration.tsx";
import NonPdlVisitorRegistration from "./pages/visitor_management/non-pdl-visitor-data-entry/NonPdlVisitorRegistration.tsx";
import ServiceProviderRegistration from "./pages/visitor_management/service-provider-data-entry/ServiceProviderRegistration.tsx";
import Test from "./pages/Test.tsx";
import VisitorProfileSlider from "./pages/LOG/visitor-profiles/VisitorProfileSlider.tsx";
import QrReader from "./pages/screening/qr-reader/QrReader.tsx";

// Lazy-loaded components
const Home = React.lazy(() => import("./pages/dashboard/Home.tsx"));
const Login = React.lazy(() => import("./pages/Login"));
const RootLayout = React.lazy(() => import("./layout/RootLayout"));

function App() {
    const isAuthenticated = useAuthStore().isAuthenticated

    const router = createBrowserRouter([
        {
            path: "*",
            element: <GeneralErrorElement />
        },
        {
            path: "/login",
            element: <Login />,
        },
        {
            path: "/",
            element: <Landing />
        },
        {
            path: "map",
            element: <MapContent />
        },
        {
            path: "/jvms",
            element: isAuthenticated ? <RootLayout /> : <Navigate to="/login" />,
            children: [
                {/*
                    index: true,
                    element: <Home />,
                */},
                {
                    index: true,
                    element: <Dashboard />
                },
                {
                    path: "home",
                    element: <Home1 />
                },
                {
                    path: "home",
                    element: <Home2 />
                },
                {
                    path: "dashboard",
                    element: <Dashboard />
                },
                {
                    path: "dashboard2",
                    element: <Home />
                },
                {
                    path: "map",
                    element: <MapContent />
                },
                {
                    path: "assets",
                    element: <Assets />
                },
                {
                    path: "assets/jail-facility",
                    element: <JailFacility />
                },
                {
                    path: "assets/annex",
                    element: <Annex />
                },
                {
                    path: "assets/levels",
                    element: <Level />
                },
                {
                    path: "assets/dorms",
                    element: <Dorm />
                },
                {
                    path: "assets/areas",
                    element: <JailArea />
                },
                {
                    path: "assets/jail-type",
                    element: <JailType />
                },
                {
                    path: "assets/jail-categories",
                    element: <JailCategory />
                },
                {
                    path: "assets/jail-security",
                    element: <JailSecurityLevel />
                },
                {
                    path: "assets/devices",
                    element: <Device />
                },
                {
                    path: "assets/devices-types",
                    element: <DeviceType />
                },
                {
                    path: "assets/devices-usage",
                    element: <DeviceUsage />
                },
                {
                    path: "maintenance",
                    element: <Maintenance />
                },
                {
                    path: "maintenance/record-status",
                    element: <RecordStatus />
                },
                {
                    path: "maintenance/social-media-platforms",
                    element: <SocialMedia />
                },
                {
                    path: "maintenance/gender",
                    element: <Gender />
                },
                {
                    path: "maintenance/civil-status",
                    element: <CivilStatus />
                },
                {
                    path: "maintenance/id-types",
                    element: <ID_Types />
                },
                {
                    path: "maintenance/religion",
                    element: <Religion />
                },
                {
                    path: "maintenance/ethnicities",
                    element: <Ethnicity />
                },
                {
                    path: "maintenance/occupation",
                    element: <Occupation />
                },
                {
                    path: "maintenance/educational-attainments",
                    element: <EducationalAttainment />
                },
                {
                    path: "maintenance/prefixes",
                    element: <Prefixes />
                },
                {
                    path: "maintenance/suffixes",
                    element: <Suffixes />
                },
                {
                    path: "maintenance/contact-types",
                    element: <ContactType />
                },
                {
                    path: "maintenance/address-types",
                    element: <AddressType />
                },
                {
                    path: "maintenance/nationalities",
                    element: <Nationality />
                },
                {
                    path: "maintenance/multi-birth-classification",
                    element: <MultiBirth />
                },
                {
                    path: "settings",
                    element: <GeneralSetting />
                },
                {
                    path: "users",
                    element: <User />
                },
                {
                    path: "users/user",
                    element: <Users />
                },
                {
                    path: "users/roles",
                    element: <Roles />
                },
                {
                    path: "users/role-levels",
                    element: <RoleLevel />
                },
                {
                    path: "tools",
                    element: <Tools />
                },
                {
                    path: "integrations",
                    element: <Integration />
                },
                {
                    path: "supports",
                    element: <Support />
                },
                {
                    path: "reports",
                    element: <Report />
                },
                {
                    path: "incidents",
                    element: <Incidents />
                },
                {
                    path: "threats",
                    element: <Threat />
                },
                {
                    path: "screening",
                    element: <Screening />
                },
                {
                    path: "screening/qr-code",
                    element: <QrReader />
                },
                {
                    path: "pdls",
                    element: <PDL />
                },
                {
                    path: "pdls/pdl",
                    element: <PDLs />
                },
                {
                    path: "pdls/skills",
                    element: <Skills />
                },
                {
                    path: "pdls/talents",
                    element: <Talents />
                },
                {
                    path: "pdls/court-branches",
                    element: <CourtBranch />
                },
                {
                    path: "visitors",
                    element: <Visitors />
                },
                {
                    path: "visitors/visitor",
                    element: <Visitor />
                },
                {
                    path: "visitors/visitor-type",
                    element: <VisitorType />
                },
                {
                    path: "visitors/visitor-req-docs",
                    element: <VisitorReqDocs />
                },
                {
                    path: "visitors/visitor-relationship",
                    element: <VisitorRelationship />
                },
                {
                    path: "visitors/visitor-registration",
                    element: <VisitorRegistration />
                },
                {
                    path: "visitors/visitor-identification",
                    element: <VisitorCodeIdentification />
                },
                {
                    path: "visitors/landscape",
                    element: <IdentificationLandscape />
                },
                {
                    path: "visitors/issues",
                    element: <Issues />
                },
                {
                    path: "visitors/non-pdl-visitor",
                    element: <NonPdlVisitorRegistration />
                },
                {
                    path: "visitors/service-provider",
                    element: <ServiceProviderRegistration />
                },
                {
                    path: "personnels",
                    element: <Personnels />
                },
                {
                    path: "personnels/personnel",
                    element: <Personnel />
                },
                {
                    path: "personnels/ranks",
                    element: <Rank />
                },
                {
                    path: "personnels/positions",
                    element: <Position />
                },
                {
                    path: "personnels/employment-type",
                    element: <EmploymentType />
                },
                {
                    path: "personnels/affiliation-type",
                    element: <AffiliationType />
                },
                {
                    path: "personnels/gender",
                    element: <Gender />
                },
                {
                    path: "personnels/civil-status",
                    element: <CivilStatus />
                },
                {
                    path: "personnels/id-types",
                    element: <ID_Types />
                },
                {
                    path: "personnels/record-status",
                    element: <RecordStatus />
                },
                {
                    path: "personnels/social-media-platforms",
                    element: <SocialMedia />
                },
                {
                    path: "database",
                    element: <Database />
                },
                {
                    path: "registration",
                    element: <Registration />
                },
                {
                    path: "registration/bjmp-personnel",
                    element: <BJMPPersonnel />
                },
                {
                    path: "registration/pdl-registration",
                    element: <PdlRegistration />
                },
                {
                    path: "registration/personnel-registration",
                    element: <PersonnelRegistration />
                },
                {
                    path: "database/judicial-courts",
                    element: <Court />
                },
                {
                    path: "database/interest",
                    element: <Interest />
                },
                {
                    path: "database/looks",
                    element: <Looks />
                },
                {
                    path: "log-monitoring",
                    element: <LogMonitoring />
                },
                {
                    path: "log-monitoring/visit-logs",
                    element: <VisitLog />
                },
                {
                    path: "log-monitoring/visitor_check-in-out_profiles",
                    element: <VisitorProfileSlider />
                },
                {
                    path: "test",
                    element: <Test />
                },
            ],
        },
    ],
        {
            future: {
                v7_startTransition: true
            },
        }
    );

    if (!isAuthenticated) {
        return <RouterProvider router={router} />;
    }

    return (

        <Suspense fallback={<Spinner />} >
            <RouterProvider router={router} />
        </Suspense>


        // <RouterProvider router={router} />

    );
}

export default App;
