import { MenuBarExtra } from "@raycast/api";
import { usePromise } from "@raycast/utils";

import osUtils from "os-utils";
import { useInterval } from "usehooks-ts";

export default function Command() {
  let loading = true;
  const { revalidate, data: cpu } = usePromise(() => {
    loading = true;
    return new Promise((resolve) => {
      return osUtils.cpuUsage((v) => {
        loading = false;
        resolve(Math.round(v * 100).toString());
      });
    });
  });
  useInterval(revalidate, 1000);

  return (
    <>
      <MenuBarExtra icon="newcpu.png" title={`${cpu ?? 0}%`} isLoading={loading}>
        <MenuBarExtra.Item title="Refresh" />
      </MenuBarExtra>
    </>
  );
}
