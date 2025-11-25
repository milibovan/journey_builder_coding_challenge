import {ComponentPreview, Previews} from "@react-buddy/ide-toolbox";
import {PaletteTree} from "./palette";
import App from "../App.tsx";
import CustomFlow from "../components/CustomFlow.tsx";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/App">
                <App/>
            </ComponentPreview>
            <ComponentPreview path="/Flow">
                <CustomFlow/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;