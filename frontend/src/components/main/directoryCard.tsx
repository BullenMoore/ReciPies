import { Link } from "react-router";

import type { DirectoryEntry } from "../../api/recipeApi";
import {routeHelper} from "../../helpers.tsx";

interface Props {
    directory: DirectoryEntry;
}


export function DirectoryCard({ directory }: Props) {


    return (
        <div>
            <Link to={routeHelper(directory.path)} className="card directory-card">
                <span className="card-icon">📁</span>
                <span>{directory.name}</span>
            </Link>
        </div>
    );
}