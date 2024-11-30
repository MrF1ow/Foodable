import { RotatingLines } from "react-loader-spinner";

function Loader() {
  return (
    <RotatingLines
      strokeColor="primary"
      strokeWidth="5"
      animationDuration="1"
      width="96"
      visible={true}
    />
  );
}

export default Loader;
