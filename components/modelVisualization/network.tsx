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
        [reverse ? "source" : "target"]: Math.round(
          /*
          This is rounder by introducing a bias towards
          the center :), but not all nodes have links :(
          */
          // (Math.random() * (id - 1) * 1) / (id / N)

          /*
          This is less round :(, but all nodes have links :)
          */
          Math.random() * (id - 1)

          /*
          This is rounder :), and all nodes have links :)
          */
          // Anyone wanna fill in the blank? lol
        ),
      })),
  };
}

export default function Graph(props: any) {
  const { modelSize } = props;
  const fgRef = useRef<any>();

  return (
    <ForceGraph3D
      ref={fgRef}
      graphData={genRandomTree(Math.ceil(modelSize / 5), false)}
      linkColor={() => "rgb(255,255,255, 150)"}
      nodeColor={() => "rgb(99,102,241)"}
      nodeOpacity={1.0}
      nodeRelSize={5}
      backgroundColor="rgba(0,0,0,0)"
      width={526}
      height={526}
      showNavInfo={false}
      cooldownTicks={240}
      onEngineStop={() => {
        console.log("Engine stopped...");
        if (fgRef.current && fgRef.current.zoomToFit) {
          console.log("Zooming...");
          fgRef.current.zoomToFit(400);
        }
      }}
    />
  );
}
