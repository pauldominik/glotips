//jQuery.noConflict();
(function initGlotips($, glotips) {

	$.fn.glotify = function(dictionary, options) {
		var self = this;

		//dictionary || dictionary = {};
		if (typeof dictionary == 'undefined' || $.isEmptyObject(dictionary)) {
			throw new Error('Glotip:dictionary is either empty or undefined');
			exit;
		}

		// options
		var settings = $.extend({
			tipsClass: 'glotip', // class added to texts that launch a popover, note that they are dyn created <a> tags
			tags:'p, li', // these tags' innerText will be scanned, inner tags, like <span> or <a> are ignored
			oncePerTag: true,

			// these are just boostrap popover options, http://getbootstrap.com/javascript/#popovers
			placement: 'auto top',
			trigger: 'focus',
			viewport: '.article-body',
			animation: true,
			template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title">hey</h3><div class="popover-content"></div></div>',
		}, options );

		// selector
		var $contentToGlotify = this;

		// we have to make sure that the container has position:relative as popover will use percentage width
		$contentToGlotify.css('position', 'relative');

		this.settings = settings;

		// methods
		this.getDictionary = function(){
			return dictionary;
		}
		/**
		 * Glotify single node
		 *
		 * @param htmlEm, HTMLElement
		 * @var jQuery
		 */
		this.glotifyElement = function glotifyElement(htmlEm){

			// only do it if passed an HTMLElement
			if (htmlEm instanceof HTMLElement) 
			{
				// use jquery convenience
				var $em = $(htmlEm);
				var text = $em.html();
				
				// iterate on each dictionary term
				$.each(dictionary, function(dTerm, dDefinition){

					var matchHandler = function(p1, p2) {
						tabindex = 0;
						return ((p2==undefined)||p2=='')?p1:'<a data-toggle="popover" tabindex="'+(++tabindex)+'" role="button" data-trigger="focus" title="'+dTerm+'" data-content="'+dDefinition+'" class="'+settings.tipsClass+'" title="'+dDefinition+'">'+p1+'</a>';
					}
					var regexFlag = settings.oncePerTag?'i':'gi';
					text = text.replace(new RegExp('('+dTerm+')(?![^<]*>|[^<>]*<\/)', regexFlag), matchHandler);
				})
				$em.html(text);
			}
			else
			{
				throw new Error('Please pass in an instanceof HTMLElement only')
			}
			return $em.html();
		};

		// select all elements we are interested in, limit our context within .content
		$selectedEms = $contentToGlotify.find(settings.tags);

		// iterate over each element, note the context for 'this' changes within .each
		$selectedEms.each(function(index){
			self.glotifyElement(this);
		})

		// initialize them all
		$('[data-toggle="popover"]').popover(settings);

		// leak global
		return window.glotips = this;
	};


})(jQuery, window.glotips || (window.glotips = {}));

//load it here instead
jQuery(document).ready(function($){

	$.getJSON( "/hc/theme_assets/135579/200062933/dictionary.json", function( data ) {
		var dictionary = {};
		$.each( data.dictionary, function( i, obj ) {
			dictionary[obj.term] = obj.def;
		});

		$('.article-body').glotify(dictionary, {viewport: '.article-body', tags: 'p,li'});

	});

});