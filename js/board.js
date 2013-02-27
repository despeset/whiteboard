define([ 'app', 'jquery'  ], 
function( app ,  $ 		  ){
	var board = _.extend({},Backbone.Events);
	app.proxy('board', board);
	board.init = function( canvas ){
	  // init
      var $c      = $(canvas)
        , ctx     = $c[0].getContext('2d')
        , spooler = []
        , drawing = []
        , line    = []
        , start   = false
        , size    = { width: $(window).width()
                    , height: $(window).height() }

      // set canvas size
      $c.attr(size)

      // config brush
      ctx.lineWidth   = 1
      ctx.lineCap     = 'round'
      ctx.lineJoin    = 'round'
      ctx.strokeStyle = 'rgba(255,0,0,1)'

      // record drawing to canvas
      function draw( e ){
        var cx = e.clientX
          , cy = e.clientY
        ctx.lineTo(cx, cy)
        line.push( new Date().getTime() - start )
        line.push( cx )
        line.push( cy )
        ctx.stroke()
        ctx.closePath()
        ctx.beginPath()
        ctx.moveTo(cx, cy)
      }
      
      function lineStart( e ){
        board.trigger('lineStart', board);
        if( !start )
          start = new Date().getTime()
        ctx.beginPath()
        ctx.moveTo(e.clientX, e.clientY)
        drawing.push( line = [] );
        $c.bind('mousemove', draw);
      }

      function lineEnd( e ){
        board.trigger('lineEnd', board);
        $c.unbind('mousemove', draw);
      }

      board.ctx = ctx;
      board.drawing = drawing;

      board.record = function record(e){
        board.trigger('record', board);
        start = new Date().getTime()
        $c.bind('mousedown', lineStart);
        $c.bind('mouseup', lineEnd);
      };

      // randomly mutate a point by + or - force
      var force = 2.5
      function jitter( point ){
        return point + ( 0-force + Math.random()*force )
      }

      // draw loop
      var player = -1;

      board.play = function play(){
        ctx.clearRect(0,0,size.width,size.height)
        ctx.beginPath()
        for( var line=0,u=drawing.length;line<u;line++ ){
          ctx.moveTo( jitter( drawing[line][1] ), jitter( drawing[line][2] ))
          for( var point=0,pu=drawing[line].length;point<pu;point+=3 ){
            ctx.lineTo( jitter( drawing[line][point+1] ), jitter( drawing[line][point+2] ) )
          }
        }
        ctx.stroke()
        ctx.closePath()
        player = requestAnimationFrame(play)
      }

      board.spool = function spool(){
      	board.trigger('spool', board);
	  	spooler = board.spooler = drawing;
	  	drawing = board.drawing = [];
	  	for( var line = 0, lu = spooler.length; line < lu; line++ ){
	  		drawing.push([]);
	  		for( var point = 0, pu = spooler[line].length; point < pu; point += 3 ){
		  		setTimeout((function(line, point){ return function(){
		  			drawing[line].push( spooler[line][point] );
		  			drawing[line].push( spooler[line][point+1] );
		  			drawing[line].push( spooler[line][point+2] );
		  		}})(line, point), spooler[line][point] );
		  	}
	  	}
      };

      board.stop = function stop(e){
        board.trigger('stop', board);
        cancelAnimationFrame(player);
        $c.unbind('mousedown mouseup');
      };

      board.trigger('init', board);

	}
	return board;
});