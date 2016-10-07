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
			tipsCssNamespace: 'glotip',
			tags:'p, li', // tags to scrape, inner tags will automatically be affected
			tagsUntouched: '', // todo: specify tags where inner text will not be handled, use only if these tags expected to be childrend of tags listed in tags property in this config/settings
		}, options );

		// selector
		var $contentToGlotify = this;

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
						//console.log('p1', p1, 'p2', p2);
						return ((p2==undefined)||p2=='')?p1:'<span data-tooltip="" data-tooltip-class="tooltip glotippop" data-click-open="true" class="has-tip '+settings.tipsCssNamespace+'" title="'+dDefinition+'">'+p1+'</span>';
					}
					//text = text.replace(new RegExp('(?!<span data-tooltip[^>]*?>)('+dTerm+')(?![^<]*?</span>)', 'gi'), '<span data-tooltip class="has-tip '+settings.tipsCssNamespace+'" title="'+dDefinition+'">$1</span>');

					// don't recurse if phrase/key is used in the glossary definition, i.e. within the data-tooltip tag: (?!<span data-tooltip[^>]*?>)
					// don't touch matching terms within html tags
					//text = text.replace(new RegExp('<[^>]+>|(?!<span data-tooltip[^>]*?>)('+dTerm+')(?![^<]*?</span>)', 'gi'), matchHandler);
					//text = text.replace(new RegExp('<[^>]+>|('+dTerm+')', 'gi'), matchHandler);
					//text = text.replace(new RegExp('<[^>]+>|(?!<em[^>]*?>)('+dTerm+')(?![^<]*?<\/em>)', 'gi'), matchHandler);
					text = text.replace(new RegExp('<[^>]+>|('+dTerm+')', 'gi'), matchHandler);
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

		// after all is done, make sure tooltips are reinitialized
		$(document).foundation()

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

		$('.article-body').glotify(dictionary);

	});

});