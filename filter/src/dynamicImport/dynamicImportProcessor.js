import { lazy } from "react";
import config from "./config";

const components = {};
for (let i = 0; i < config.length; i++) {
    components[config[i].name] = lazy(() =>
        import(`${config[i].path}`).then((module) => ({
            default: module[config[i].name]
        }))
    );
}
export default components;
