import type { NextApiRequest, NextApiResponse } from "next";
import { supabaseServer } from "../../services/clients/supabaseServer";

const RUNPOD_API_KEY = process.env.RUNPOD_API_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;

interface Pod {
  id: string;
  name: string;
  runtime: {
    uptimeInSeconds: number;
    ports: {
      ip: string;
      isIpPublic: boolean;
      privatePort: number;
      publicPort: number;
      type: string;
    }[];
    gpus: {
      id: string;
      gpuUtilPercent: number;
      memoryUtilPercent: number;
    }[];
    container: {
      cpuPercent: number;
      memoryPercent: number;
    };
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<string>
) {
  // Get the number of workers
  const response = await fetch(
    `https://api.runpod.io/graphql?api_key=${RUNPOD_API_KEY}`,
    {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        query:
          "query Pods { myself { pods { id name runtime { uptimeInSeconds ports { ip isIpPublic privatePort publicPort type } gpus { id gpuUtilPercent memoryUtilPercent } container { cpuPercent memoryPercent } } } } }",
      }),
    }
  );

  const pods = (await response.json()).data.myself.pods as Pod[];

  if (pods.length === 0) {
    // start pods
    const response = await fetch(
      `https://api.runpod.io/graphql?api_key=${RUNPOD_API_KEY}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          mutation: `mutation {
            podFindAndDeployOnDemand(
              input: {
                cloudType: ALL, 
                gpuCount: 1, 
                volumeInGb: 128,
                containerDiskInGb: 128,
                minVcpuCount: 4,
                minMemoryInGb: 12,
                gpuTypeId: "NVIDIA RTX A5000",
                name: "finetune-sh-deploy",
                imageName: "chitalian/finetune-sh:0.0.1",
                dockerArgs: "/usr/bin/bash -i -c \"python3.9 main_demo.py\"",
                volumeMountPath: "/workspace",
                env: [
                  {key: "SUPABASE_API_URI", value: "${NEXT_PUBLIC_SUPABASE_URL}"},
                  {key: "SUPABASE_SERVICE_KEY", value: "${SUPABASE_SERVICE_KEY}"}
                ]
              }
            ) { 
              id
              imageName
              env
              machineId
              machine {
                podHostId	
              }
            }
          }`,
        }),
      }
    );
    if (response.status === 200) {
      const pod = (await response.json()).data.podFindAndDeployOnDemand as Pod;
      console.log("Started pod", pod);
      res.status(200).json("Success!");
    } else {
      console.log("Failed to start pod", response);
      res.status(response.status).json(response.statusText);
    }
  } else {
    // pod already running
    res.status(200).json("Pod already running!");
  }
}
