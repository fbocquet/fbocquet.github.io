
//gestion des grilles
var grille = {

	points: [],
	init: function(){
		// on determine la taille de la grille
		var tmp = $('<div>').addClass("photo").hide()
			.css('width', config.photos.width)
			.css('height', config.photos.height) ;
			
		$('body').append(tmp);

		taille = {

			x: parseInt($(window).width() / tmp.outerWidth(true) ),
			y: parseInt($modes.offset().top / tmp.outerHeight(true))

		}

		//On initialise les cases

		for (var i = 0; i < taille.x; i++) {
			grille.points[i] = [];
			for (var j = 0; j < taille.y; j++) {
				
				grille.points[i][j] = false ;

			};
		};

		tmp.remove();
	},

	placer: function(elements){
		elements.each(function(){

			var x, y ;

			do {
				x = Math.floor(Math.random()* grille.points.length);
				y = Math.floor(Math.random()* grille.points[0].length);
			}while(grille.points[x][y] != false);

			grille.points[x][y] = $(this) ;

			$(this).css('top', y * $(this).outerWidth(true) + 'px');
			$(this).css('left', x * $(this).outerHeight(true) + 'px');
		})
	},

	aimanter: function(element){

		setTimeout(function(){

			var pos = {

				x: element.offset().left,
				y: element.offset().top,

			}

			var longueur = element.outerWidth(true);
			var hauteur = element.outerHeight(true);
	

			if(pos.x > longueur * (grille.points.length-1))
			{
				pos.x = longueur * (grille.points.length - 1) ;
			}

			var dx = pos.x % longueur;
			pos.x -= dx;

			if(dx > longueur / 2)
			{
				pos.x += longueur ;
			}

			if(pos.y + hauteur >= (grille.points[0].length) * hauteur)
			{
				pos.y = (grille.points[0].length-1) * hauteur;
			}

			var dy = pos.y % hauteur;
			pos.y -= dy;

			if(dy > hauteur / 2)
			{
				pos.y += hauteur ;
			}

			element.stop(true, true).animate({
				top: pos.y + 'px',
				left : pos.x + 'px'
			}, 100);

			// on convertit les pixels en coordonnées sur la grille
			pos.x = parseInt(pos.x / longueur) ;
			pos.y = parseInt(pos.y / hauteur );

			if( grille.points[pos.x][pos.y] != false)
			{
				grille.compenser(pos.x, pos.y);
			}

			grille.points[ pos.x ][ pos.y ] = element ;
		
		}, 110)
	},


	compenser: function(x, y){

		function iter(x, y){

			if(x < grille.points.length-1)
			{
				x++;
			}
			else if(x == grille.points.length-1 && y == grille.points[0].length-1)
			{
				x = 0;
				y = 0;
			}
			else
			{
				x = 0 ;
				y++ ;
			}

			return {x: x, y: y}
		}

		if(grille.points[x][y] != false)
		{
			var pos = iter(x, y);

			if(grille.points[pos.x][pos.y] != false)
			{
				grille.compenser( pos.x, pos.y );
			}

			var element = grille.points[x][y];

			element.animate({
				left: (pos.x * element.outerWidth(true) + 'px'),
				top : (pos.y * element.outerHeight(true) + 'px')
			}, 200);

			grille.points[x][y] = false ;
			grille.points[pos.x][pos.y] = element;
		}

	}
}

//Gestion de la barre de preferences
var $modes = $("#mode");
for (var i = 0; i < config.modes.length; i++) {
	$modes.append( $("<li>").text(config.modes[i].name).addClass("button") );
};
$modes.children(':first-child').insertAfter( $modes.children(':last-child') );

if(config.modes.length == 1){ $modes.hide(); }
$modes.children(":first-child").attr('id', 'active-mode');

$number_photos = $('#nb-images').val( config.defaultNbPhotos )
.change(function(){

	if($(this).val() > config.maxNbPhotos)
	{
		$(this).val(config.maxNbPhotos);	
	}

});


$("#plus").click(function(){

	tmp_number = parseInt($number_photos.val()) + 1 ;

	if(tmp_number <= config.maxNbPhotos)
		$number_photos.val( tmp_number );
});

$("#minus").click(function(){

	tmp_number = parseInt($number_photos.val()) - 1 ;

	if(tmp_number > 0)
		$number_photos.val( tmp_number );
});

$("#mode").children().click(function(){

	$(this).parent().find("#active-mode").attr('id', '');
	$(this).attr('id', 'active-mode');
});

//Gestion du drag'n'drop
var drag = { target: null };

$("#get-images").click(function(){

	$(".photo").remove();
	var number_photos = parseInt($('#nb-images').val());

	var photo_id = [];
	var chosen_mode = $modes.children().index( $("#active-mode") );
	var index_mode = chosen_mode ;

	for (var i = 0; i < number_photos; i++) {
		var id, mode, present ;

		do {

			present = false ;
			if(chosen_mode == config.modes.length)
			{
				index_mode = Math.round(Math.random()* (config.modes.length-1));
			}

			mode = config.modes[index_mode];
			id = Math.floor(Math.random()* (mode.maxId+1));

			for (var i = 0; i < photo_id.length; i++) {
				if(photo_id[i].mode == mode && photo_id[i].id == id)
				{
					present = true;
					break ;
				}
			};

		} while (present);
		
		photo_id.push( { mode: mode, id: id} );
	};

	for (var i = 0; i < photo_id.length; i++) {
		var src = "library/" + photo_id[i].mode.name + "/" + photo_id[i].id + ".png" ;

		$('body').append( 
			$("<div>").addClass('photo').append( 
				$('<img>').attr('src', src)
			).addClass('draggable')
		);
	};	

	//On active le drag'n'drop des images
	var $images = $(".draggable");

	$images
	.css('width', config.photos.width)
	.css('height', config.photos.height)
	.mousedown(function(e){

		drag.target = $(this);

		var pos = $(this).offset();
		drag.origin = {

			x: parseInt(pos.left / $(this).outerWidth(true)) ,
			y: parseInt(pos.top / $(this).outerHeight(true))
		};

		grille.points[ drag.origin.x ][ drag.origin.y ] = false ;

		drag.offsetLeft = e.pageX - drag.target.offset().left;
		drag.offsetTop = e.pageY - drag.target.offset().top;

		drag.target.stop(true, true).animate({
			width: "+=10px",
			height: "+=10px",
			margin: "-5px 0 0 -5px",
			opacity: 0.5
		}, 100)
	});

	$(document).mouseup(function(e){

		if(drag.target){

			drag.target.stop(true, true).animate({
				width: config.photos.width,
				height: config.photos.height,
				margin: "0",
				opacity: 1,

			}, 100);

			grille.aimanter(drag.target);
		}

		drag.target = null ;
	});

	$(document).mousemove(function(e) { // Permet le suivi du drag & drop
		var target = drag.target;
		
		if (target) {

			target.css('top', e.pageY - drag.offsetTop + 'px');
			target.css('left', e.pageX - drag.offsetLeft + 'px');
		}
	});

	grille.init();
	grille.placer($images);
}).trigger("click")  ;

