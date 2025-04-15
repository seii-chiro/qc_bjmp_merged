import { NavLink } from "react-router-dom";

export const Breadcrumb = ({ url }: { url: string }) => {
    const parts = url.split(/[_/]/).filter(Boolean); // Remove empty parts

    return (
        <nav className="flex items-center gap-2">
            {parts.map((part, index) => {
                const path = "/" + parts.slice(0, index + 1).join("/"); // Build path correctly

                return (
                    <span key={index} className="flex items-center">
                        {index > 0 && <span className="mx-1">&gt;</span>}
                        <NavLink to={path} className="text-gray-600 hover:underline">
                            {part.toUpperCase()}
                        </NavLink>
                    </span>
                );
            })}
        </nav>
    );
};
