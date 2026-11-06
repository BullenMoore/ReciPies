import { useNavigate } from "react-router-dom";
import { encodePath } from "../utils/paths";

function DirectoryCard({ directory }) {
    const navigate = useNavigate();

    function handleClick() {
        const path = encodePath(directory.path);
        navigate(`/browse/${path}`);
    }

    return (
        <div className="directory-card" onClick={handleClick}>
            <span>📁</span>
            <h3>{directory.name}</h3>
        </div>
    );
}

export default DirectoryCard;
