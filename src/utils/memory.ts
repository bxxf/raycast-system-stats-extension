import { exec } from "child_process";
import util from "util";

export async function getMemoryUsage() {
    const execAsync = util.promisify(exec);
    try {
      const [pHwPagesize, pMemTotal, pVmPagePageableInternalCount, pVmPagePurgeableCount, pPagesWired, pPagesCompressed] =
        await Promise.all([
          execAsync("/usr/sbin/sysctl -n hw.pagesize"),
          execAsync("/usr/sbin/sysctl -n hw.memsize"),
          execAsync("/usr/sbin/sysctl -n vm.page_pageable_internal_count"),
          execAsync("/usr/sbin/sysctl -n vm.page_purgeable_count"),
          execAsync("/usr/bin/vm_stat | awk '/ wired/ { print $4 }'"),
          execAsync("/usr/bin/vm_stat | awk '/ occupied/ { printf $5 }'"),
        ]);
  
      const hwPagesize = parseFloat(pHwPagesize.stdout.trim());
      const memTotal = parseFloat(pMemTotal.stdout.trim()) / 1024 / 1024;
      const pagesApp =
        parseFloat(pVmPagePageableInternalCount.stdout.trim()) - parseFloat(pVmPagePurgeableCount.stdout.trim());
      const pagesWired = parseFloat(pPagesWired.stdout.trim());
      const pagesCompressed = parseFloat(pPagesCompressed.stdout.trim()) || 0;
      const memUsed = ((pagesApp + pagesWired + pagesCompressed) * hwPagesize) / 1024 / 1024;
  
      return `${Math.round((memUsed / memTotal) * 100)}`;
    } catch (error) {
      console.error("Error fetching memory usage:", error);
      throw error;
    }
  }
  