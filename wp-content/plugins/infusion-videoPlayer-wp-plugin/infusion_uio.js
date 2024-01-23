/*
Copyright 2013 OCAD University

Licensed under the Educational Community License (ECL), Version 2.0 or the New
BSD license. You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the ECL 2.0 License and BSD License at
https://github.com/fluid-project/infusion/raw/master/Infusion-LICENSE.txt
*/

/*global jQuery, fluid */

// JSLint options
/*jslint white: true, funcinvoke: true, undef: true, newcap: true, nomen: true, regexp: true, bitwise: true, browser: true, forin: true, maxerr: 100, indent: 4 */

/***
 * Code to set up PageEnhancer and the FatPanel on every page of this WordPress site.
 */
(function ($) {
  fluid.registerNamespace("fluid.vpPlugin");

  /**
   * Small component to announce the availability of a functioning UIO component.
   * The enhanced VideoPlayer needs access to the relay subcomponent and so can't
   * instantiate until UIO is ready.
   */
  fluid.defaults("fluid.vpPlugin.UIOAnnouncer", {
    gradeNames: ["fluid.eventedComponent", "autoInit"],
    events: {
      UIOReady: null,
    },
  });

  if (!fluid.staticEnvironment.UIOAnnouncer) {
    fluid.staticEnvironment.UIOAnnouncer = fluid.vpPlugin.UIOAnnouncer();
  }

  fluid.vpPlugin.initUIO = function () {
    fluid.pageEnhancer({
      tocTemplate:
        window.location.protocol +
        "//" +
        window.location.host +
        "/wp-content/plugins/infusion-videoPlayer-wp-plugin/lib/videoPlayer/lib/infusion/components/tableOfContents/html/TableOfContents.html",
    });

    var opts = {
      prefix:
        window.location.protocol +
        "//" +
        window.location.host +
        "/wp-content/plugins/infusion-videoPlayer-wp-plugin/lib/videoPlayer/lib/infusion/components/uiOptions/html/",
      components: {
        relay: {
          type: "fluid.videoPlayer.relay",
        },
      },
      templateLoader: {
        options: {
          templates: {
            mediaControls:
              window.location.protocol +
              "//" +
              window.location.host +
              "/wp-content/plugins/infusion-videoPlayer-wp-plugin/lib/videoPlayer/html/UIOptionsTemplate-media.html",
          },
        },
      },
      listeners: {
        afterRender: fluid.staticEnvironment.UIOAnnouncer.events.UIOReady.fire,
      },
    };
    // Custom strings for slidingPanel button are specified through the plugin admin panel
    opts.slidingPanel = {
      options: {
        strings: {
          showText: "preferences",
          hideText: "preferences",
        },
      },
    };

    var uiOptions = fluid.uiOptions.fatPanel.withMediaPanel(
      ".flc-uiOptions-fatPanel",
      opts
    );
    fluid.staticEnvironment.uiOptionsInstance = uiOptions;
  };

  $("document").ready(function () {
    if ($(".flc-uiOptions-fatPanel").length > 0) {
      // document already has UIO markup in it, we don't need to load a template
      fluid.vpPlugin.initUIO();
    } else {
      // there's no UIO markup, we need to load it, insert it, then instantiate
      $.ajax(
        window.location.protocol +
          "//" +
          window.location.host +
          "/wp-content/plugins/infusion-videoPlayer-wp-plugin/uioFatPanelTemplate.html",
        {
          type: "GET",
          success: function (data, textStatus, jqXHR) {
            $("body").prepend(data);
            fluid.vpPlugin.initUIO();
          },
          error: function (jqXHR, textStatus, errorThrown) {
            fluid.log("Error loading initial HTML for UI Options");
          },
        }
      );
    }
  });
})(jQuery);
