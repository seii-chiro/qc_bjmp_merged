import { GodotLink, Header } from "../assets/components/link"

const Visitors = () => {
    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-5 text-gray-700">
                <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                        <GodotLink link="visitor" title="Visitors" />
                        <GodotLink link="visitor-identification" title="Visitor Identification" />
                        <GodotLink link="landscape" title="Visitor Code Identificalation (Landscape)" />
                        <GodotLink link="visitor-registration" title="Visitor Registration" />
                    </div>
                <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                    <Header title="VISITOR REGISTRATION"/>
                    <div className="mt-2 ml-8">
                        <GodotLink link="pdl-visitors" title="PDL Visitor" />
                        <GodotLink link="bjmp-personnel" title="BJMP Personnel" />
                        <GodotLink link="third-party" title="3rd Party Provider" />
                        <GodotLink link="non-pdl-visitor" title="Other Non-PDL Visitors" />
                    </div>
                </div>
                <div className="border border-gray-200 p-5 w-full shadow-sm hover:shadow-md rounded-md">
                    <Header title="MAINTENANCE"/>
                    <div className="mt-2 ml-8">
                        <GodotLink link="visitor-type" title="Types of Visitors" />
                        <GodotLink link="visitor-req-docs" title="Visitor Requirement Documents" />
                        <GodotLink link="visitor-relationship" title="Visitor Relationship to PDL" />
                        <GodotLink link="issues" title="Issues and Findings" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Visitors
