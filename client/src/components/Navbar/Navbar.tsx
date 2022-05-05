import { Link } from "react-router-dom";
import classes from "./Navbar.module.scss";

const Navbar = () => {
    return (
        <nav className={classes.navigation}>
            <Link to="/">Nodes</Link>
            <Link to="/table">Table</Link>
        </nav>
    );
};

export default Navbar;
