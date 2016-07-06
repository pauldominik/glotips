# Glotips

Adds glossary feature on HTML content. Uses tooltips by Zurb Foundation to show definitions. [See demo](https://debug1.pauldominik.com/glotips) 

## Usage

- requires jquery, foundation 6.2.1 css, custom foundation having tooltip only
- initialize by:

```js
var dictionary = {
	'term1': 'definition1',
	'term2': 'definition2'
}
var options = {
	tipsCssNamespace: 'glotip',
	tags:'p, li', // tags to scrape, inner tags will automatically be affected
	tagsUntouched: '', // todo: specify tags where inner text will not be handled, use only if these tags expected to be childrend of tags listed in tags property in this config/settings
}
$('#someContent').glotips(dictionary, options);
```

## Global

window.glotips

## methods

getDictionary();
glotifyElement();
