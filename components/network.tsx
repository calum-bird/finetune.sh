import dynamic from "next/dynamic";
import { useRef } from "react";

const ForceGraph3D = dynamic(() => import("./forceGraph3D"), {
  ssr: false,
});

function genRandomTree(N = 300, reverse = false) {
  return {
    nodes: [...Array(N).keys()].map((i) => ({ id: i })),
    links: [...Array(N).keys()]
      .filter((id) => id)
      .map((id) => ({
        [reverse ? "target" : "source"]: id,
        [reverse ? "source" : "target"]: Math.round(Math.random() * (id - 1)),
      })),
  };
}

export default function Graph(props: any) {
  const { modelSize } = props;
  const fgRef = useRef<any>();

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={genRandomTree(Math.ceil(modelSize / 5), true)}
      linkColor="rgb(255,255,255)"
      linkVisibility={true}
      linkOpacity={0.5}
      nodeColor="rgb(99,102,241)"
      nodeOpacity={1.0}
      backgroundColor="rgba(0,0,0,0)"
      width={526}
      height={526}
      showNavInfo={false}
      cooldownTicks={240}
      onEngineStop={() => {
        if (fgRef.current) {
          //fgRef.current.zoomToFit(400);
          console.log("Fix zoom lol");
        }
      }}
    />
  );
}
