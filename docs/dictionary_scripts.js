$(document).ready( function() {
	console.log( "hello world ;-)" );

	const jSource = "georges836971.json" ; //"Lee462732.json"
	const vocabSource = "french_vocab.json" ; 
	const translationSource = "translation.json";
	
	const alphabet = [ "a" , "b" , "c" , "d" , "e" , "f" , "g" , "h" , "i" , "j" , "k" , "l" , "m" , "n" , "o" , "p" , "q" , "r" , "s" , "t" , "u" , "v" , "w" , "x" , "y" , "z" , "à" , "â" , "ç" , "é" , "ê" , "î" , "œ" ];

	//french to english translation list
	let translations
	$.getJSON( translationSource , function( data ) {
		translations = data;
	})

	//word list with word data, part of speech info etc
	$.getJSON( vocabSource , function( data ) {
		
		var items = [];
		
		var vobab_list = [];
		
		data.vocab_overview.sort(function(a, b) {
			return a.word_string > b.word_string;
		});
		
		let currentLetter = "";
		let newLetter
		$.each( data.vocab_overview, function( key, val ) {
			newLetter = val.word_string.substr(0, 1);
			if( newLetter != currentLetter ){
				$(".dictionary-words ul.words").append( $("<li/>").addClass("alphabet-divider").text( newLetter.toUpperCase() ).attr( "letter" , newLetter ) );
				currentLetter = newLetter;
			}
			$(".dictionary-words ul.words").append( 
				$("<li/>").addClass("list-word").text( val.word_string ).attr({
					"wordref": val.id,
					"srcref": key				
				}).on( "click" , function(e){
					$( ".current-word" ).removeClass( "current-word" );
					$(this).addClass( "current-word" );
					getWordDetails( val );
				})
			);
		});
		
		function getWordDetails( val ){
			
			let $translations = $("<div/>").addClass( "definition-translations card" )
			
			$.each( translations[ val.word_string ] , function( i ){
				$translations.append( $("<div/>").addClass( "translation" ).text( translations[ val.word_string ][i] ) )
			});
			
			let $properties = $("<div/>").addClass( "definition-properties" );
			
			if( val.gender != null ){
				$properties.append( $("<span/>").addClass("gender-title " + val.gender.toLowerCase() ).text( "Gender:" ) );
				$properties.append( $("<span/>").addClass("gender" ).text( val.gender.toUpperCase().substr(0, 1) ) );
			}
			if( val.infinitive != null ){
				$properties.append( $("<span/>").addClass("infinitive-title").text( "Infinitive:" ) );
				$properties.append( $("<span/>").addClass("infinitive").text( val.infinitive ) );
			}
			if( val.pos != null ){
				$properties.append( $("<span/>").addClass("pos-title").text( "Part of speech:" ) );
				$properties.append( $("<span/>").addClass("pos").text( val.pos ) );
			}
			
			let $related = $("<div/>").addClass("related");
			
			if( val.related_lexemes.length > 0 ){
				$related.append( $("<span/>").addClass( "related-title" ).text( "Variations:" ));
				$.each( val.related_lexemes , function( i ){
					$related.append( $("<span/>").addClass( "related-words card interactive" ).text( $(".list-word[wordref='" + val.related_lexemes[i] + "']").text() )
						.on( "click" , function(){
							$(".list-word[wordref='" + val.related_lexemes[i] + "']").click();
						})
					);
				})
			}
			
			let $lessons = $("<div/>").addClass("lessons card");
			$lessons.append( $("<span/>").addClass( "lessons-title" ).text( "Lesson:" ));
			$lessons.append( $("<span/>").addClass( "lesson card" ).text( val.skill ));

			$(".dictionary-definition").html( "" )
				.append( $("<div/>").addClass( "definition-title card" ).html( "<h1>" + val.word_string  + "</h1>" )//word
					.append( $related ) //related words
					.append( $properties ) //word properties
				) 
				.append( $translations ) //translated meaning
				.append( $lessons ) //Duolingo lessons that teaches the word
				

		}
		
		generateQuickLinks();
		reshapeAlphabet();
	});

	//main Duolingo data - inlcudes user data / progress, and course structure
	$.getJSON( jSource , function( data ) {
		if( data.language_data.cy != undefined ){//welsh data (not used in this demo)
			showData( data.language_data.cy )
		} else if ( data.language_data.fr != undefined ){//french data
			showData( data.language_data.fr )
		}
	});
	
	function generateQuickLinks (){
		$.each( alphabet , function( i ){
			const $alphaLink = $("<li/>").addClass( "alpha-link" ).attr("letter" , alphabet[i] ).text( alphabet[i].toUpperCase() )
			$(".alphabet-shortcuts").append( $alphaLink );

			if( $(".alphabet-divider[letter='" + alphabet[i] + "']").length == 0 ){
			//quick fix for there being no "W" or "X" words in dictionary
				$alphaLink.addClass( "empty" );
			} else {
				$alphaLink.on( "click" , function(){
					$(".dictionary-words").animate( { scrollTop : Math.abs( $(".alphabet-divider[letter='" + $(this).attr( "letter" ) + "']").position().top + $(".dictionary-words").scrollTop() ) - 30 }, function() {
						setTimeout( function(){
							$( ".alpha-link" ).removeClass( "selected" );
							$alphaLink.addClass("selected");
						} , 20 );
					});
				})
			}
		})
	}
	
	$(".dictionary-words").on( "scroll" , function(){
		//highlight alphabet shortcut for current section
		const scrollTop = $(".dictionary-words").scrollTop();

		$(".dictionary-words-hint").toggleClass( "previous-hint" , scrollTop > 30 );
		$(".dictionary-words-hint").toggleClass( "next-hint" , scrollTop < $(".dictionary-words .words").height() - $(".dictionary-words").height() - 30 );
		
		for( let i = 0 ; i < $( ".alphabet-divider" ).length ; i ++ ){
			if( $($( ".alphabet-divider" )[i]).position().top > 0 ){
				$( ".alpha-link" ).removeClass( "selected" );
				$($( ".alpha-link" )[ Math.max( 0 , i -1 ) ]).addClass( "selected" );
				break;
			}
		};
	});
	
	//make alphabet-shortcuts full width if space allows
	let resizeTimeout ;
	$(window).on( "resize" , function(){
		clearTimeout( resizeTimeout );
		resizeTimeout = setTimeout( reshapeAlphabet , 100 );
	})
	
	function reshapeAlphabet(){
		//I'm sure there's a good way to calculate this exactly, but as a "fudge" this works.
		const alphaWidth = ( Math.min( $( window ).width() , 2000 ) - ( ($(".alphabet-shortcuts li").width() + 5) * 32 ) ) / 60 ;
		$(".alphabet-shortcuts li").css( { "padding-left" : alphaWidth , "padding-right" :alphaWidth } );
	}

	
	//get all lessons from Duolingo and put into correct order - for showing course info in phase 2
	//for now, use to cross reference words and the topics they are covered in
	function showData( lang ){
		//re-order by coordinates as that's order of progress
		lang.skills.sort(function(a, b) {
			return parseFloat(a.coords_y + (a.coords_x/10)) - parseFloat(b.coords_y + (b.coords_x/10));
		});
			
		let allWords = [];

		$.each( lang.skills , function( key , val ){

			const newWords = allWords.concat(val.words);
			allWords = newWords ;
		})
		
		
	}
	
	/* 
	//sample phrases to use to show learning path functionality - a nice to have phase 2
	var samplePhrases = [
		"Une phrase simple avec des mots variés pour démontrer combien de mots seraient appris à différentes étapes de l'apprentissage."
		]
	*/
	
	 
});