define([ 'jquery', 'underscore', 'backbone' ], 
function( $      ,  _          ,  Backbone  ){

    /**
     *  The app singleton object is used as a Backbone dispatcher throughout the dependencies.
     *  Usually, this is the only file coupled with a given Model, View or Collection.
     *  Works on a pub/sub basis for controlling interactions without rigid depencdency structures.
     */

    // Start with the Backbone Events methods, mixed with any app values set before boot
    var app = _.extend( ( window.app || {} ) , Backbone.Events );

    /**
     *  Utility methods
     *  ------------------------------------------------------------------------------------
     */
        
    /**
     *  Cancels a `jQuery#Event`, preventing any default behaviors.
     *  Use as the return value for your jQuery event callback `return app.cancel( event )`
     *
     *  @param {jQuery#Event}
     *  @return false
     */

    app.cancel = function( event ){
        event.stopImmediatePropagation();
        event.preventDefault();
        return false;
    }

    /**
     * Logger
     */
    app.log = app.log || function(){ console.log.apply( console, arguments ) };

    /**
     *  Event Management Methods
     *  ------------------------------------------------------------------------------------
     */

    /**
     *  Proxy all events from <sender> onto the app within the <namespace> prefix.
     *  This is used all over the place to connect disparite models to the main app context.
     *      
     *      app.proxy( 'truck', truck );
     *      truck.trigger( 'honk' );
     *
     *  Then events automatically bubble up:
     *
     *      truck <(honk)
     *        app <(truck:honk)
     *
     *  @param {String} deligate map
     *  @param {Object} something implimenting the `Backbone#Events` style `#on('all')` handler
     */

    app.proxy = function proxy( namespace, sender ){
        sender.on( 'all', function(){ 
            var args = arguments;
            args[0] = namespace + ':' + args[0];
            app.trigger.apply( app, args );
        });
    };

    /**
     *  Process batch subscriptions in a style similiar to he Backbone.View element event deligation style
     *
     *  @param {Object} deligate map
     *  @param {Object} scope for event callbacks
     */

    app.deligate = function deligate( deligates, context ){
        for( eventName in deligates ){
            app.on( eventName, deligates[eventName], context );
        }
    };

    /**
     *  Process batch unsubscriptions.
     *
     *  @param {Object} deligate map
     */

    app.undeligate = function undeligate( deligates ){
        for( eventName in deligates ){
            app.off( eventName, deligates[eventName] );
        }
    };

    /**
     *  Debugger
     *  ------------------------------------------------------------------------------------
     */

 
    /**
     *  Unless the event name matches one of our exclusions, output it to the console.
     */

    var exclusions = [];
    var debugLogger = function(){
        if( !exclusions.length || !arguments[0].match(new RegExp( exclusions.join('|') )) ){
            app.log( arguments );
        }
    };

    /**
     *  Turns on the debugger
     *
     *  @param {Object} options
     */

    app.debug = function debug( options ){
        app.off( 'all', debugLogger );
        app.on( 'all', debugLogger );
        try{ exclusions = options.exclude; } catch(err){}
        return app;
    };

    // return the app
    return app;

});