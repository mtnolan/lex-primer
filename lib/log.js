const isDebugEnabled = () => process.env.DEBUG_LOG === "true";

const log = (level, msg, params) => {
  if (level === "DEBUG" && !isDebugEnabled()) {
    return;
  }

  const logMsg = {};
  logMsg.level = level;
  logMsg.message = msg;
  logMsg.params =
    params instanceof Error
      ? { message: params.toString(), stack: params.stack }
      : params;

  try {
    const cache = [];
    const message = JSON.stringify(logMsg, (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (cache.indexOf(value) !== -1) {
          // Duplicate reference found
          try {
            // If this value does not reference a parent it can be deduped
            return JSON.parse(JSON.stringify(value));
          } catch (error) {
            // discard key if value cannot be deduped
            return null;
          }
        }
        // Store value in our collection
        cache.push(value);
      }
      return value;
    });

    // eslint-disable-next-line no-console
    console.log(message);
  } catch (err) {
    log("ERROR", "Failure stringifing log message", { error: err });
  }
};

module.exports.debug = (msg, params) => log("DEBUG", msg, params);
module.exports.info = (msg, params) => log("INFO", msg, params);
module.exports.warn = (msg, params) => log("WARN", msg, params);
module.exports.error = (msg, params) => log("ERROR", msg, params);
