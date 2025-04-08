import { Scrollbars } from "react-custom-scrollbars-2";
import "../../styles/components/CustomScrollbar.css";

const CustomScrollbar = ({ children }) => {
  return (
    <Scrollbars
      autoHide
      renderTrackVertical={(props) => (
        <div {...props} className="trackVertical" />
      )}
      renderThumbVertical={(props) => (
        <div {...props} className="thumbVertical" />
      )}
    >
      {children}
    </Scrollbars>
  );
};

export default CustomScrollbar;
