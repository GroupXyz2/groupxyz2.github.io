/**
 * Group's Analytics
 * Version 1.0
 * Author GroupXyz
 */

(function(window, document) {
    var config = {
      endpoint: 'https://pickaxegaming.de:3223/analytics',
      durationEndpoint: 'https://pickaxegaming.de:3223/analytics/duration',
      trackPageviews: true,
      trackClicks: true,
      trackForms: true,
      trackScroll: true,
      trackTime: true,
      anonymizeIP: false,
      debugMode: false
    };
    
    var sessionId = 'session_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
    var pageLoadTime = new Date();
    var maxScrollDepth = 0;
    
    try {
      if (localStorage) {
        var entryTime = localStorage.getItem('analytics_entry_time');
        if (!entryTime) {
          localStorage.setItem('analytics_entry_time', Date.now());
        }
      }
    } catch (e) {
      debug('Error saving entry-time:', e);
    }
    
    function debug(message, data) {
      if (config.debugMode && window.console) {
        console.log('[Analytics]', message, data || '');
      }
    }
    
    function sendAnalyticsData(eventType, additionalData) {
      additionalData = additionalData || {};
      
      var analyticsData = {
        sessionId: sessionId,
        timestamp: new Date().toISOString(),
        eventType: eventType,
        page: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer || 'direct',
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        viewportWidth: window.innerWidth,
        viewportHeight: window.innerHeight,
        language: navigator.language,
        userAgent: navigator.userAgent,
        timezoneOffset: new Date().getTimezoneOffset()
      };
      
      for (var key in additionalData) {
        analyticsData[key] = additionalData[key];
      }
      
      var endpoint = eventType === 'duration' ? config.durationEndpoint : config.endpoint;
      
      debug('Sending analytics data', analyticsData);
      
      if (navigator.sendBeacon && (eventType === 'duration' || eventType === 'unload')) {
        navigator.sendBeacon(endpoint, JSON.stringify(analyticsData));
      } else {
        fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(analyticsData),
          keepalive: true
        }).catch(function(error) {
          debug('Error sending', error);
        });
      }
    }
    
    function trackPageview() {
      if (!config.trackPageviews) return;
      
      var performance = window.performance;
      var timing = performance && performance.timing;
      var navigationStart = timing ? timing.navigationStart : 0;
      
      var performanceData = {};
      
      if (timing) {
        performanceData = {
          loadTime: timing.loadEventEnd - navigationStart,
          domReadyTime: timing.domContentLoadedEventEnd - navigationStart,
          renderTime: timing.domComplete - timing.domLoading,
          networkLatency: timing.responseEnd - timing.requestStart,
          redirectTime: timing.redirectEnd - timing.redirectStart || 0,
          firstPaint: 0
        };
        
        if (performance.getEntriesByType && typeof PerformancePaintTiming !== 'undefined') {
          var fpEntry = performance.getEntriesByType('paint').find(function(entry) {
            return entry.name === 'first-contentful-paint';
          });
          
          if (fpEntry) {
            performanceData.firstPaint = Math.round(fpEntry.startTime);
          }
        }
      }
      
      sendAnalyticsData('pageview', performanceData);
    }
    
    function trackClicks(event) {
      if (!config.trackClicks) return;
      
      var target = event.target;
 
      while (target && 
             !(target.tagName === 'A' || 
               target.tagName === 'BUTTON' || 
               target.tagName === 'INPUT' && (target.type === 'button' || target.type === 'submit'))) {
        target = target.parentElement;
      }
      
      if (target) {
        var isLink = target.tagName === 'A';
        var isButton = target.tagName === 'BUTTON' || (target.tagName === 'INPUT' && (target.type === 'button' || target.type === 'submit'));
        
        var elementData = {
          elementType: isLink ? 'link' : 'button',
          elementId: target.id || 'unknown',
          elementClass: target.className || 'none',
          elementText: target.innerText || target.textContent || target.value || 'no text',
          targetBlank: isLink ? target.target === '_blank' : false
        };
        
        if (isLink && target.href) {
          elementData.elementHref = target.href;
          
          var isExternal = target.href.indexOf(window.location.hostname) === -1;
          elementData.isExternal = isExternal;
          
          if (!isExternal && target.target !== '_blank' && !event.ctrlKey && !event.metaKey) {
            event.preventDefault();
            
            sendAnalyticsData('click', elementData);
            
            setTimeout(function() {
              window.location.href = target.href;
            }, 150);
            return;
          }
        }
        
        if (isButton && ((target.type === 'submit' && target.form) || (target.tagName === 'BUTTON' && target.form))) {
          elementData.formAction = target.form.action || 'keine';
          elementData.formMethod = target.form.method || 'get';
          elementData.formId = target.form.id || 'unknown';
        }
        
        sendAnalyticsData('click', elementData);
      }
    }
    
    function trackFormSubmit(event) {
      if (!config.trackForms) return;
      
      var form = event.target;
      var formData = {
        formId: form.id || 'unknown',
        formAction: form.action || window.location.href,
        formMethod: form.method || 'get',
        formFields: form.elements.length
      };
      
      var searchInput = form.querySelector('input[type="search"], input[name="q"], input[name="query"], input[name="s"]');
      if (searchInput) {
        formData.isSearch = true;
        formData.searchTerm = searchInput.value;
      }
      
      sendAnalyticsData('form_submit', formData);
      
      if (form.method.toLowerCase() === 'post' && !hasAjaxHandler(form)) {
        event.preventDefault();
        setTimeout(function() {
          form.submit();
        }, 150);
      }
    }
    
    function hasAjaxHandler(form) {
      return form.dataset.ajax === 'true' || 
             form.dataset.remote === 'true' || 
             form.classList.contains('ajax-form');
    }
    
    function trackScrollDepth() {
      if (!config.trackScroll) return;
      
      var scrollPosition = window.scrollY;
      var documentHeight = Math.max(
        document.body.scrollHeight, 
        document.documentElement.scrollHeight,
        document.body.offsetHeight, 
        document.documentElement.offsetHeight
      );
      var windowHeight = window.innerHeight;
      var scrollPercentage = Math.floor((scrollPosition + windowHeight) / documentHeight * 100);
      
      if (scrollPercentage > maxScrollDepth) {
        maxScrollDepth = scrollPercentage;
        
        if (maxScrollDepth === 25 || maxScrollDepth === 50 || maxScrollDepth === 75 || maxScrollDepth === 90) {
          sendAnalyticsData('scroll_depth', {
            scrollPercentage: maxScrollDepth
          });
        }
      }
    }
    
    function trackDuration() {
      if (!config.trackTime) return;
      
      var now = new Date();
      var durationSeconds = (now - pageLoadTime) / 1000;
      
      sendAnalyticsData('duration', {
        durationSeconds: durationSeconds,
        maxScrollDepth: maxScrollDepth
      });
      
      try {
        if (localStorage) {
          var entryTime = parseInt(localStorage.getItem('analytics_entry_time'), 10);
          if (entryTime && !isNaN(entryTime)) {
            var totalDuration = (Date.now() - entryTime) / 1000;
            sendAnalyticsData('session_duration', {
              totalDurationSeconds: totalDuration
            });
          }
        }
      } catch (e) {
        console.error('Error saving session duration:', e);
      }
    }
    
    function setupEventListeners() {
      if (document.readyState === 'complete') {
        trackPageview();
      } else {
        window.addEventListener('load', trackPageview);
      }
      
      document.addEventListener('click', trackClicks);
      
      document.addEventListener('submit', trackFormSubmit);
      
      var scrollTimeout;
      window.addEventListener('scroll', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(trackScrollDepth, 100);
      });
      
      window.addEventListener('beforeunload', trackDuration);
    }
    
    var Analytics = {
      configure: function(customConfig) {
        for (var key in customConfig) {
          config[key] = customConfig[key];
        }
        return this;
      },

      trackEvent: function(eventCategory, eventAction, eventLabel, eventValue) {
        sendAnalyticsData('custom_event', {
          eventCategory: eventCategory,
          eventAction: eventAction,
          eventLabel: eventLabel,
          eventValue: eventValue
        });
        return this;
      },

      setDebug: function(enabled) {
        config.debugMode = !!enabled;
        return this;
      },

      setUserProperties: function(properties) {
        try {
          if (localStorage && properties) {
            var stored = JSON.parse(localStorage.getItem('analytics_user_props') || '{}');
            for (var key in properties) {
              stored[key] = properties[key];
            }
            localStorage.setItem('analytics_user_props', JSON.stringify(stored));
          }
        } catch (e) {
          debug('Error saving user analytics', e);
        }
        return this;
      },

      getConfig: function() {
        return Object.assign({}, config);
      }
    };

    setupEventListeners();

    window.Analytics = Analytics;
    
  })(window, document);
