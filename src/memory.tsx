import { MenuBarExtra } from "@raycast/api";
import { usePromise } from "@raycast/utils";

import { useInterval } from "usehooks-ts";
import { getMemoryUsage } from "./utils/memory";

export default function Command() {
  let loading = true;
  const { revalidate, data: ram } = usePromise(() => {
    loading = true;
    return new Promise(async (resolve) => {
      getMemoryUsage().then((res) => {
        loading = false;

        resolve(res);
      });
    });
  });
  useInterval(revalidate, 1000);

  return (
    <>
      <MenuBarExtra icon="mem.png" title={`${ram ?? 0}%`} isLoading={true}>
        <MenuBarExtra.Item title={`🖥️CPU`} />
      </MenuBarExtra>
    </>
  );
}
