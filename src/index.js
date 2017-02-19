//NOTE: This script does not save the actual event timestamps, because GA ignores events if they are older than a few hours.
let gaWrapper =  {
  resendInterval: false, //has to be reset to false when cleared
  blocked: false,
  //Play with these two values to change behaviour of resending cached events.
  //Just sending 1 request at a time with 1s Timeout seemed to give the least ignored events
  NUM_SENT_PER_BATCH: 1,
  BATCH_TIMEOUT: 1000,
  RETRY_INTERVAL: 5000,
  ga: function () {
    if (navigator.onLine) {
      ga(...arguments);
    } else {
      this.cache([...arguments]);
    }
  },
  cache: function (args) {
    let gaCache = this.getCache();
    gaCache.push({
      args: args,
      timeStamp: Date.now(),
    });
    this.setCache(gaCache);
    this.setResendInterval();
  },
  tryResend: function () {
    if (!navigator.onLine || this.blocked) return;
    let gaCache = this.getCache();
    let self = this;
    for (var i = 0; i < gaCache.length; i++) {
      let req = gaCache.pop();
      self.ga(...req.args);
      if ((this.NUM_SENT_PER_BATCH-1) == i) {
        this.setCache(gaCache);
        self.blocked = true;
        this.setResendInterval();
        setTimeout(function () {
          self.blocked = false;
        }, this.BATCH_TIMEOUT);
        return;
      } 
    }
    this.setCache([]);
    //succesfull resend
    this.clearResendInterval();
  },
  setResendInterval: function () {
    if (this.resendInterval) return;
    let self = this;
    this.resendInterval = setInterval(function () {
      self.tryResend(); //will clear interval itself
    }, this.RETRY_INTERVAL);
  },
  clearResendInterval: function () {
    if (this.resendInterval !== false) {
      clearInterval(this.resendInterval);
      this.resendInterval = false;
    }
  },
  getCache: function () {
    try {
      return JSON.parse(localStorage.getItem("gaCache")) || [];
    } catch(err) {
      return [];
    }
  },
  setCache: function (val) {
    try {
      localStorage.setItem("gaCache", JSON.stringify(val));
    } catch(err) {
    }
  },
};

//try sending old requests 
gaWrapper.tryResend();



module.exports = gaWrapper;
