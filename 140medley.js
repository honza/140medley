/*
 * 140 medley
 * (c) 2011 - Honza Pokorny
 * Licensed under the terms of the BSD license
 *
 * This is a micro-framework or a collection of small, helpful utilities for
 * common javascript tasks.
 *
 * Size:
 *   Source:  8.6 kb
 *   Minified: 821 bytes
 *   gzipped: 504 bytes
 *
 * Features:
 *  - templating - t();
 *  - local storage - s();
 *  - bind/unbind events - b();
 *  - create DOM elements - m();
 *  - DOM selector - $();
 *  - Get cross-browser xhr - j();
 *
 */

/*
 * Templating
 *
 * Usage:
 *  var hello = t("Hello, #{this.name || 'world'}!")
 *
 *  console.log( // => "Hello, Jed!"
 *    hello({name: "Jed"})
 *  )
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/964762
 */

var t = function(
  a, // the string source from which the template is compiled
  b  // the default `with` context of the template (optional)
){
  return function(
    c, // the object called as `this` in the template
    d  // the `with` context of this template call (optional)
  ){
    return a.replace(
      /#{([^}]*)}/g, // a regexp that finds the interpolated code: "#{<code>}"
      function(
        a, // not used, only positional
        e  // the code matched by the interpolation
      ){
        return Function(
          "x",
          "with(x)return " + e // the result of the interpolated code
        ).call(
          c,    // pass the data object as `this`, with
          d     // the most
          || b  // specific
          || {} // context.
        )
      }
    )
  }
};

/*
 * LocalStorage
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/966030
 *
 */

var s = function(
  a, // placeholder for storage object
  b  // placeholder for JSON
){
  return b
    ? {                 // if JSON is supported
      get: function(    // provide a getter function
        c               // that takes a key
      ){
        return a[c] &&  // and if the key exists
          b.parse(a[c]) // parses and returns it,
      },

      set: function(     // and a setter function
        c,               // that takes a key
        d                // and a value
      ){
        a[c] =           // and sets
          b.stringify(d) // its serialization.
      }
    }
    : {}                 // if JSON isn't supported, provide a shim.
}(
  this.localStorage // use native localStorage if available
  || {},            // or an object otherwise
  JSON              // use native JSON (required)
)

/*
 * Bind/Unbind events
 *
 * Usage:
 *   var el = document.getElementyById('#container');
 *   b(el, 'click', function() {
 *     console.log('clicked');
 *   });
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/968186
 *
 */

var p = function(
  a, // a DOM element
  b, // an event name such as "click"
  c, // (placeholder)
  d  // (placeholder)
){
  c = c || document; // use the document by default
  d = c[             // save the current onevent　handler
    b = "on" + b     // prepent the event name with "on"
  ];
  a = c[b] =                 // cache and replace the current handler
    function(e) {            // with a function that
      d = d && d(            // executes/caches the previous handler
        e = e || c.event     // with a cross-browser object,
      );

      return (a = a && b(e)) // and calls the passed function,
        ? b                  // returning the current handler if it rebinds
        : d                  // and the previous handler otherwise.
    };
  c = this // cache the window to fetch IE events
};

/*
 * Create DOM element
 *
 * Usage:
 *   var el = m('<h1>Hello</h1>');
 *   document.body.appendChild(el);
 *
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/966233
 *
 */

var m = function(
  a, // an HTML string
  b, // placeholder
  c  // placeholder
){
  b = document;                   // get the document,
  c = b.createElement("p");       // create a container element,
  c.innerHTML = a;                // write the HTML to it, and
  a = b.createDocumentFragment(); // create a fragment.

  while (                         // while
    b = c.firstChild              // the container element has a first child
  ) a.appendChild(b);             // append the child to the fragment,

  return a                        // and then return the fragment.
}

/*
 * DOM selector
 *
 * Usage:
 *   $('div');
 *   $('#name');
 *   $('.name');
 *
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is> - WTFPL
 * More: https://gist.github.com/991057
 *
 */

var $ = function(
  a,                         // take a simple selector like "name", "#name", or ".name", and
  b                          // an optional context, and
){
  a = a.match(/^(\W)?(.*)/); // split the selector into name and symbol.
  return(                    // return an element or list, from within the scope of
    b                        // the passed context
    || document              // or document,
  )[
    "getElement" + (         // obtained by the appropriate method calculated by
      a[1]
        ? a[1] == "#"
          ? "ById"           // the node by ID,
          : "sByClassName"   // the nodes by class name, or
        : "sByTagName"       // the nodes by tag name,
    )
  ](
    a[2]                     // called with the name.
  )
}


/*
 * Get cross browser xhr object
 *
 *
 *            DO WHAT THE FUCK YOU WANT TO PUBLIC LICENSE
 *                    Version 2, December 2004
 *
 * Copyright (C) 2011 Jed Schmidt <http://jed.is>
 * More: https://gist.github.com/993585
 *
 */

var j = function(
  a // cursor placeholder
){
  for(                     // for all a
    a=0;                   // from 0
    a<4;                   // to 4,
    a++                    // incrementing
  ) try {                  // try
    return a               // returning
      ? new ActiveXObject( // a new ActiveXObject
          [                // reflecting
            ,              // (elided)
            "Msxml2",      // the various
            "Msxml3",      // working
            "Microsoft"    // options
          ][a] +           // for Microsoft implementations, and
          ".XMLHTTP"       // the appropriate suffix,
        )                  // but make sure to
      : new XMLHttpRequest // try the w3c standard first, and
  }

  catch(e){}               // ignore when it fails.
}

