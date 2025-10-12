import { Spin } from "antd";

const Loader = ({ text = "Loading...", height = "60vh" }) => {
  return (
    <div
      style={{
        height,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Spin size="large" tip={text} />
    </div>
  );
};

export default Loader;
