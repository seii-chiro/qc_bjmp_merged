import { GodotLink, Header } from "../assets/components/link"

const PDL = () => {
    return (
        <div className="flex flex-wrap gap-5">
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <Header title="PDLs Information"/>
                <div className="mt-2 ml-8">
                    <GodotLink link="pdl" title="PDL" />
                    <GodotLink link="pdl-profile" title="PDL Profile" />
                    <GodotLink link="pdl-registration" title="PDL Registration" />
                    <GodotLink link="authorized-visitor" title="Authorized Visitor" />
                    <GodotLink link="gang-affiliations" title="Gang Affiliations" />
                </div>
            </div>
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <div className="mt-2 ml-8">
                    <GodotLink link="police-precincts" title="Police Precincts" />
                    <GodotLink link="court-branches" title="Courts/Branches" />
                    <GodotLink link="offenses" title="Offenses" />
                    <GodotLink link="laws" title="Laws" />
                    <GodotLink link="crime-categories" title="Crime Categories" />
                </div>
            </div>
            <div className="border text-gray-700 border-gray-200 p-5 w-96 shadow-sm hover:shadow-md rounded-md">
                <Header title="Maintenance"/>
                <div className="mt-2 ml-8">
                    <GodotLink link="" title="Ethnicities" />
                    <GodotLink link="" title="Skills" />
                    <GodotLink link="" title="Talents" />
                    <GodotLink link="" title="Interests" />
                    <GodotLink link="" title="Looks" />
                    <GodotLink link="" title="Relationships" />
                </div>
            </div>
        </div>
    )
}

export default PDL
