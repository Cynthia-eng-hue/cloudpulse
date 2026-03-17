// Web Worker for processing logs
self.onmessage = (e: MessageEvent) => {
  const { logs, filter, keyword } = e.data;
  
  let processedLogs = logs;

  if (filter && filter !== 'all') {
    processedLogs = processedLogs.filter((log: any) => log.level === filter);
  }

  if (keyword) {
    const lowKeyword = keyword.toLowerCase();
    processedLogs = processedLogs.filter((log: any) => 
      log.message.toLowerCase().includes(lowKeyword) || 
      log.service.toLowerCase().includes(lowKeyword)
    );
  }

  self.postMessage(processedLogs);
};
